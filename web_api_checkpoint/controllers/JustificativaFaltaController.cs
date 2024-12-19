using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.Repositories;
using web_api_checkpoint.ViewModels.Justificativa;

namespace web_api_checkpoint.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JustificativaFaltaController : ControllerBase
    {
        private readonly IJustificativaFaltaRepository _justificativaFaltaRepository;

        public JustificativaFaltaController(IJustificativaFaltaRepository justificativaFaltaRepository)
        {
            _justificativaFaltaRepository = justificativaFaltaRepository;
        }


        [HttpPost]
        public async Task<IActionResult> CadastrarJustificativa([FromForm] CadastrarJustificativaFalta cadastrarJustificativaFalta)
        {
            try
            {

                bool result = await _justificativaFaltaRepository.CadastrarJustificativa(cadastrarJustificativaFalta);

                if (!result)
                {
                    return StatusCode(400);
                }

                return StatusCode(201);
            }
            catch (Exception e)
            {

                return BadRequest(e.InnerException?.Message);
            }
        }


        [HttpPut]
        public async Task<IActionResult> ValidarJustificativa(ValidarJustificativaFalta validarJustificativaFalta)
        {
            try
            {

                bool result = await _justificativaFaltaRepository.ValidarJustificativa(validarJustificativaFalta);

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

        [HttpGet("ListarTodasAsJustificativasDeFalta")]
        public IActionResult ListarTodasAsJustificativasDeFalta()
        {
            try
            {
                return StatusCode(200, _justificativaFaltaRepository.ListarTodasAsJustificativasDeFalta());
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }
    }
}
