using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_api_checkpoint.Contexts;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Utils.Mail;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecuperarSenhaController : ControllerBase
    {
        private readonly CheckpointContext _context;
        private readonly EmailSendingService _emailSendingService;


        public RecuperarSenhaController(CheckpointContext context, EmailSendingService emailSendingService)
        {
            _context = context;
            _emailSendingService = emailSendingService;
        }

        [HttpPost]
        public async Task<IActionResult> SendRecoveryCodePassword(string email)
        {
            try
            {
                Usuario? user = await _context.Usuario.FirstOrDefaultAsync(x => x.EmailCorporativo == email || x.EmailPessoal == email);

                if (user == null)
                {

                    return StatusCode(404, "Usuário não encontrado!");
                }

                //gerar um codigo com 6 algarismos
                Random random = new();
                int recoveryCode = random.Next(100000, 1000000);

                user.CodigoRecSenha = recoveryCode.ToString();

                await _context.SaveChangesAsync();

                await _emailSendingService.SendRecovery(user.EmailCorporativo!, recoveryCode);

                return (Ok("Código enviado com sucesso"));
            }
            catch (Exception erro)
            {
                return BadRequest(erro.Message);
            }
        }

        //CRIE UM CONTROLLER PARA VALIDAR O CODIGO ENVIADO PARA O EMAIL
        //SE O CODIGO FOR IGUAL, RESETE O CODIGO ANTERIOR NO BANCO E DEVOLVA UM STATUS CODE INFORMANDO SE O CODIGO E INVALIDO
        [HttpPost("ValidarCodigo")]
        public async Task<IActionResult> ValidatePasswordRecoveryCode(string email, string codigo)
        {
            try
            {
                var user = await _context.Usuario.FirstOrDefaultAsync(x => x.EmailCorporativo == email || x.EmailPessoal == email);


                if (user == null)
                {

                    return StatusCode(404, "Usuário não encontrado!");
                }


                if (user.CodigoRecSenha != codigo)
                {
                    return BadRequest("Codigo de recupercao invalido");

                }

                user.CodigoRecSenha = null;

                await _context.SaveChangesAsync();

                return Ok("Codigo de recuperacao valido");
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }

    }
}