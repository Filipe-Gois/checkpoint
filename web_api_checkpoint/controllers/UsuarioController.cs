using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.Utils.Mail;
using web_api_checkpoint.ViewModels.Usuario;

namespace web_api_checkpoint.controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly EmailSendingService _emailSendingService;

        public UsuarioController(EmailSendingService emailSendingService, IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
            _emailSendingService = emailSendingService;
        }

        [HttpPost]
        public async Task<IActionResult> CadastrarUsuario(CadastrarUsuario cadastrarUsuario)
        {
            try
            {
                bool result = _usuarioRepository.CadastrarUsuario(cadastrarUsuario);

                if (!result) return StatusCode(400, "Não foi possível criar a conta!");

                string nomeCompleto = cadastrarUsuario.Nome + " " + cadastrarUsuario.SobreNome;

                await _emailSendingService.SendWelcomeEmail(cadastrarUsuario.EmailPessoal!, nomeCompleto!);
                await _emailSendingService.SendWelcomeEmail(cadastrarUsuario.EmailCorporativo!, nomeCompleto!);
                return StatusCode(201);


            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }


        [HttpPut("AlterarSenha")]
        public IActionResult AlterarSenha(string email, string senhaNova)
        {
            try
            {
                bool result = _usuarioRepository.AlterarSenha(email, senhaNova);

                if (!result) return StatusCode(400, "Erro ao alterar senha!");

                return Ok("Senha alterada com sucesso !");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("ArquivarUsuario")]
        public IActionResult ArquivarOuDesarquivarUsuario(Guid idUsuario)
        {
            try
            {
                bool result = _usuarioRepository.ArquivarOuDesarquivarUsuario(idUsuario);

                if (!result) return StatusCode(400, "Erro ao arquivar usuário!");

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ListarTodosOsUsuarios")]
        public IActionResult ListarTodosOsUsuarios()
        {
            try
            {
                return StatusCode(200, _usuarioRepository.ListarTodosOsUsuarios());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ListarEstagiariosDoGestor")]
        public IActionResult ListarEstagiariosDoGestor(Guid idGestor)
        {
            try
            {
                return StatusCode(200, _usuarioRepository.ListarEstagiariosDoGestor(idGestor));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //[HttpPut("AtualizarUsuario")]
        //public IActionResult AtualizarUsuario(Guid idUsuario, AtualizarUsuario atualizarUsuario)
        //{
        //    try
        //    {
        //        bool result = _usuarioRepository.AtualizarUsuario(idUsuario, atualizarUsuario);

        //        if (!result)
        //        {
        //            return StatusCode(400, "Erro ao atualizar dados do usuário!");
        //        }

        //        return StatusCode(204);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}
    }
}
