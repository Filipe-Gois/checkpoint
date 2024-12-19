using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.Repositories;

namespace web_api_checkpoint.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PresencaController : ControllerBase
    {
        private readonly IPresencaRepository _presencaRepository;

        public PresencaController(IPresencaRepository presencaRepository)
        {
            _presencaRepository = presencaRepository;
        }

        [HttpGet("ListarPresencasDoEstagiario")]
        public IActionResult ListarPresencasDoEstagiario(Guid id)
        {
            try
            {
                return StatusCode(200, _presencaRepository.ListarPresencasDoEstagiario(id));
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpGet("ListarFaltasNaoJustificadasDoEstagiarioNosUltimos30Dias")]
        public IActionResult ListarFaltasNaoJustificadasDoEstagiarioNosUltimos30Dias(Guid idEstagiario)
        {
            try
            {
                return StatusCode(200, _presencaRepository.ListarFaltasNaoJustificadasDoEstagiarioNosUltimos30Dias(idEstagiario));
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        //[HttpPost]
        //public IActionResult GerarPresenca()
        //{
        //    try
        //    {
        //        _presencaRepository.GerarPresenca();
        //        return StatusCode(201);
        //    }
        //    catch (Exception e)
        //    {

        //        return BadRequest(e.Message);
        //    }
        //}

        // Eu amo o Chezzi
        [HttpPut("BaterPontoSaida")]
        public IActionResult BaterPontoSaida(Guid idEstagiario)
        {
            try
            {
                bool result = _presencaRepository.BaterPontoSaida(idEstagiario);

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
