using Microsoft.AspNetCore.Mvc;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.Repositories;
using web_api_checkpoint.Utils.Mail;
using web_api_checkpoint.ViewModels.Squad;
using web_api_checkpoint.ViewModels.Usuario;

namespace web_api_checkpoint.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SquadController : ControllerBase
    {
        private readonly ISquadRepository _squadRepository;


        public SquadController(ISquadRepository squadRepository)
        {
            _squadRepository = squadRepository;
        }


        [HttpPost]
        public IActionResult CadastrarSquad(CadastrarSquad squad)
        {
            try
            {
                bool result = _squadRepository.CadastrarSquad(squad);

                if (!result) return StatusCode(400, "Não foi possível criar o squad!");


                return StatusCode(201);


            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpPut("ArquivarOuDesarquivarSquad")]
        public IActionResult ArquivarOuDesarquivarSquad(Guid idSquad)
        {
            try
            {
                bool result = _squadRepository.ArquivarOuDesarquivarSquad(idSquad);

                if (!result) return StatusCode(400, "Não foi possível alterar o status!");

                return StatusCode(201);

            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }


        [HttpPut("AtualizarSquad")]
        public IActionResult AtualizarSquad(Guid idSquad, AtualizarSquad squad)
        {
            try
            {
                bool result = _squadRepository.AtualizarSquad(idSquad, squad);

                if (!result) return StatusCode(400, "Não foi possível atualizar o squad!");

                return StatusCode(204);

            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpGet("ListarTodosOsSquads")]
        public IActionResult ListarTodosOsSquads()
        {
            try
            {
                return StatusCode(200, _squadRepository.ListarTodosOsSquads());
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpGet("ListarSquadsComEstatisticasDosEstagiarios")]
        public IActionResult ListarSquadsComEstatisticasDosEstagiarios()
        {
            try
            {
                return StatusCode(200, _squadRepository.ListarSquadsComEstatisticasDosEstagiarios());
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }


        [HttpGet("ListarSquadsDoGestor")]
        public IActionResult ListarSquadsDoGestor(Guid idGestor)
        {
            try
            {
                return StatusCode(200, _squadRepository.ListarSquadsDoGestor(idGestor));
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

    }
}
