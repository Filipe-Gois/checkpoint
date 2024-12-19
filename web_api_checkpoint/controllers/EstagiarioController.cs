using Microsoft.AspNetCore.Mvc;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.ViewModels.Ranking;
using web_api_checkpoint.ViewModels.Usuario.Estagiario;

namespace web_api_checkpoint.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstagiarioController : ControllerBase
    {
        private readonly IEstagiarioRepository _estagiarioRepository;

        public EstagiarioController(IEstagiarioRepository estagiarioRepository)
        {
            _estagiarioRepository = estagiarioRepository;
        }

        [HttpGet("ExibirRanking")]
        public IActionResult ExibirRanking()
        {
            try
            {
                return StatusCode(200, _estagiarioRepository.ExibirRanking());
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }
        [HttpGet("BuscarEstagiario")]
        public IActionResult BuscarEstagiario(Guid idEstagiario)
        {
            try
            {
                ExibirEstatisticasEstagiario exibirEstagiario = _estagiarioRepository.BuscarEstagiario(idEstagiario);

                if (exibirEstagiario == null)
                {
                    return StatusCode(404);
                }

                return StatusCode(200, exibirEstagiario);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpGet("GerarRelatorioEstagiario")]
        public IActionResult GerarRelatorioEstagiario(Guid idEstagiario)
        {
            try
            {
                byte[] arquivoPDF = _estagiarioRepository.GerarRelatorioEstagiario(idEstagiario);

                if (arquivoPDF == null || arquivoPDF.Length == 0 || arquivoPDF == null)
                {
                    return NotFound("Erro ao gerar relatório.");
                }

                return File(arquivoPDF, "application/pdf", "relatorio_estagiario.pdf");
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

    }
}
