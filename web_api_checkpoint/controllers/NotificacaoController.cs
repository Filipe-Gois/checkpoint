using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.ViewModels.Notificacao;

namespace web_api_checkpoint.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificacaoController : ControllerBase
    {
        private readonly INotificacaoRepository _notificacaoRepository;

        public NotificacaoController(INotificacaoRepository notificacaoRepository)
        {
            _notificacaoRepository = notificacaoRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CadastrarNotificacao(Notificacao notificacao)
        {
            try
            {
                await _notificacaoRepository.CadastrarNotificacao(notificacao);
                return StatusCode(201);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpGet("BuscarNotificacoesDoUsuario")]
        public async Task<IActionResult> BuscarNotificacoesDoUsuario(Guid idUsuario)
        {
            try
            {
                List<ExibirNotificacao> notificacoes = await _notificacaoRepository.BuscarNotificacoesDoUsuario(idUsuario);
                return StatusCode(200, notificacoes);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }
    }
}
