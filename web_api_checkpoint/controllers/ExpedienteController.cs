using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.ViewModels.Expediente;

namespace web_api_checkpoint.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpedienteController : ControllerBase
    {
        private readonly IExpedienteRepository _expedienteRepository;

        public ExpedienteController(IExpedienteRepository expedienteRepository)
        {
            _expedienteRepository = expedienteRepository;
        }


        [HttpPost]
        public IActionResult Cadastrar(CadastrarExpediente cadastrarExpediente)
        {
            try
            {
                bool result = _expedienteRepository.Cadastrar(cadastrarExpediente);

                if (!result)
                {
                    return StatusCode(400, "Expediente já cadastrado!");
                }

                return StatusCode(201);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        public IActionResult ListarExpedientes()
        {
            try
            {
                return StatusCode(200, _expedienteRepository.ListarExpedientes());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
