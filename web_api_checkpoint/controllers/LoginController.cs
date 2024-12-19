using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.Repositories;
using web_api_checkpoint.ViewModels.Usuario;

namespace WebApiTechConnect.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IUsuarioRepository _usuario;

        public LoginController(IUsuarioRepository usuarioRepository)
        {
            _usuario = usuarioRepository;
        }

        [HttpPost]
        public IActionResult Login(LoginViewModel usuario)
        {
            try
            {
                //busca usuário por email e senha ou por email e id da conta google, caso esteja logando com o goole
                ExibirUsuario usuarioBuscado = _usuario.BuscarPorEmailESenhaLogar(usuario);

                if (usuarioBuscado == null)
                {
                    return StatusCode(404, "Usuário não encontrado!");
                }


                //caso encontre, prossegue para a criação do token

                //informações que serão fornecidas no token
                Claim[] claims =
                [
                    new (JwtRegisteredClaimNames.Jti, usuarioBuscado.IdUsuario.ToString()!),
                    new (JwtRegisteredClaimNames.Email, usuarioBuscado.EmailPessoal!),
                    new ("EmailCorporativo", usuarioBuscado.EmailCorporativo!),
                    new (JwtRegisteredClaimNames.Name, usuarioBuscado.Nome!),
                    new ("SobreNome", usuarioBuscado.SobreNome!),
                    new ("Role", usuarioBuscado.Role!),
                ];

                //chave de segurança
                SymmetricSecurityKey key = new(System.Text.Encoding.UTF8.GetBytes("checkpoint-symmetricsecuritykey-api"));

                //credenciais
                SigningCredentials creds = new(key, SecurityAlgorithms.HmacSha256);

                //token
                JwtSecurityToken meuToken = new(
                        issuer: "API-checkpoint",
                        audience: "API-checkpoint",
                        claims: claims,
                        expires: DateTime.Now.AddMinutes(5),
                        signingCredentials: creds
                    );




                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(meuToken)
                });
            }
            catch (Exception error)
            {
                return BadRequest(error.Message);
            }
        }
    }
}