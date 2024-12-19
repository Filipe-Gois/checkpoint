using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.Repositories;
using web_api_checkpoint.ViewModels.Tarefa;

namespace web_api_checkpoint.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TarefaController : ControllerBase
    {
        private readonly ITarefaRepository _tarefaRepository;

        public TarefaController(ITarefaRepository tarefaRepository)
        {
            _tarefaRepository = tarefaRepository;
        }

        [HttpGet("ListarTarefasDoEstagiario")]
        public IActionResult ListarTarefasDoEstagiario(Guid id)
        {
            try
            {
                return StatusCode(200, _tarefaRepository.ListarTarefasDoEstagiario(id));
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpGet("ListarTodasAsTarefas")]
        public IActionResult ListarTodasAsTarefas()
        {
            try
            {
                return StatusCode(200, _tarefaRepository.ListarTodasAsTarefas());
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpGet("ListarTarefasParaOsGestores")]
        public IActionResult ListarTarefasParaOsGestores(Guid id)
        {
            try
            {
                return StatusCode(200, _tarefaRepository.ListarTarefasParaOsGestores(id));
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpPost("CadastrarTarefa")]
        public async Task<IActionResult> CadastrarTarefa([FromForm] CadastrarTarefa cadastrarTarefa)
        {
            try
            {
                bool result = await _tarefaRepository.CadastrarTarefa(cadastrarTarefa);
                if (!result)
                {
                    return StatusCode(400);
                }
                return StatusCode(201);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpPost("EntregarTarefa")]
        public async Task<IActionResult> EntregarTarefa(Guid idTarefa, List<IFormFile> arquivos)
        {
            try
            {
                bool result = await _tarefaRepository.EntregarTarefa(idTarefa, arquivos);
                if (!result)
                {
                    return StatusCode(400);
                }
                return StatusCode(201);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpPut("AtualizarTarefa")]
        public async Task<IActionResult> AtualizarTarefa(Guid id, [FromForm] AtualizarTarefa atualizarTarefa)
        {
            try
            {
                bool result = await _tarefaRepository.AtualizarTarefa(id, atualizarTarefa);
                if (!result)
                {
                    return StatusCode(400);
                }
                return StatusCode(204);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpPut("CorrigirTarefa")]
        public async Task<IActionResult> CorrigirTarefa(Guid idTarefa, int statusCorrecao, string descricaoCorrecao)
        {
            try
            {
                bool result = await _tarefaRepository.CorrigirTarefa(idTarefa, statusCorrecao, descricaoCorrecao);
                if (!result)
                {
                    return StatusCode(400);
                }
                return StatusCode(204);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpPut("AtualizarEntregaTarefa")]
        public async Task<IActionResult> AtualizarEntregaTarefa(Guid id, [FromForm] List<IFormFile> arquivos)
        {
            try
            {
                bool result = await _tarefaRepository.AtualizarEntregaTarefa(id, arquivos);
                if (!result)
                {
                    return StatusCode(400);
                }
                return StatusCode(204);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }
    }
}
