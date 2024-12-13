using Microsoft.EntityFrameworkCore;
using System.Drawing;
using web_api_checkpoint.Contexts;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.Utils;
using web_api_checkpoint.ViewModels.Squad;
using web_api_checkpoint.ViewModels.Usuario;
using web_api_checkpoint.ViewModels.Usuario.Estagiario;
using web_api_checkpoint.ViewModels.Usuario.Gestor;

namespace web_api_checkpoint.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        CheckpointContext ctx;
        public UsuarioRepository(CheckpointContext _ctx)
        {
            ctx = _ctx;
        }

        public UsuarioRepository()
        {

        }

        public ExibirUsuario BuscarPorEmailESenhaLogar(LoginViewModel loginViewModel)
        {
            DateTime dataHoraAtual = DateTime.Now;
            Usuario usuarioBuscado = ctx.Usuario.FirstOrDefault(x => (x.EmailCorporativo == loginViewModel.Email || x.EmailPessoal == loginViewModel.Email) && x.IsActive == true)!;

            if (usuarioBuscado == null) return null!;

            if (!Criptografia.CompararHash(loginViewModel.Senha!, usuarioBuscado.Senha!))
            {
                return null!;
            }

            ctx.Usuario.Update(usuarioBuscado);

            ExibirUsuario exibirUsuario = new()
            {
                IdUsuario = usuarioBuscado.IdUsuario,
                EmailCorporativo = usuarioBuscado.EmailCorporativo,
                EmailPessoal = usuarioBuscado.EmailPessoal,
                Nome = usuarioBuscado.Nome,
                SobreNome = usuarioBuscado.SobreNome,
                Role = Enum.GetName(typeof(RoleEnum), usuarioBuscado.Role)
            };

            if (Enum.GetName(typeof(RoleEnum), usuarioBuscado.Role) == "Estagiario")
            {
                Estagiario estagiarioBuscado = ctx.Estagiario.Include(x => x.Expediente).FirstOrDefault(x => x.IdUsuario == usuarioBuscado.IdUsuario)!;

                //valida se o estagiario tá dentro do expediente para setar a presenca
                if (dataHoraAtual.TimeOfDay < estagiarioBuscado.Expediente!.FimExpediente.ToTimeSpan() && dataHoraAtual.TimeOfDay >= estagiarioBuscado.Expediente.InicioExpediente.ToTimeSpan())
                {
                    Presenca presencaBuscada = ctx.Presenca.Include(x => x.CalendarioLetivo).FirstOrDefault(x => x.IdEstagiario == estagiarioBuscado.IdEstagiario && x.CalendarioLetivo!.Data.Date == dataHoraAtual.Date)!;

                    if (presencaBuscada != null && presencaBuscada.HorarioEntrada == null)
                    {
                        presencaBuscada.HorarioEntrada = TimeOnly.FromDateTime(dataHoraAtual);

                        ctx.Presenca.Update(presencaBuscada);

                    }
                }
            }

            ctx.Usuario.Update(usuarioBuscado);
            ctx.SaveChanges();
            return exibirUsuario;
        }

        public bool CadastrarUsuario(CadastrarUsuario cadastrarUsuario)
        {

            bool roleUsuarioExiste = Enum.IsDefined(typeof(RoleEnum), cadastrarUsuario.Role);

            if (!roleUsuarioExiste)
            {
                return false;
            }

            bool emailPessoalEValido = EmailValidator.IsValidEmail(cadastrarUsuario.EmailPessoal!);
            bool emailCorporativoEValido = EmailValidator.IsValidEmail(cadastrarUsuario.EmailCorporativo!);

            if (!emailCorporativoEValido || !emailPessoalEValido) return false;

            Usuario novoUsuario = new()
            {
                EmailCorporativo = cadastrarUsuario.EmailCorporativo,
                EmailPessoal = cadastrarUsuario.EmailPessoal,
                Role = cadastrarUsuario.Role,
                Nome = cadastrarUsuario.Nome,
                SobreNome = cadastrarUsuario.SobreNome,
                Senha = Criptografia.GerarHash(cadastrarUsuario.Senha!),
            };

            ctx.Usuario.Add(novoUsuario);

            if (Enum.GetName(typeof(RoleEnum), cadastrarUsuario.Role) == "Estagiario")
            {

                Estagiario estagiario = new()
                {
                    IdEstagiario = novoUsuario.IdUsuario,
                    IdUsuario = novoUsuario.IdUsuario,
                    IdExpediente = cadastrarUsuario.IdExpediente,

                };
                ctx.Estagiario.Add(estagiario);

            }

            ctx.SaveChanges();

            return true;
        }
        public bool AlterarSenha(string email, string senhaNova)
        {

            Usuario usuarioBuscado = ctx.Usuario.FirstOrDefault(x => x.EmailCorporativo == email || x.EmailPessoal == email)!;

            if (usuarioBuscado == null) return false;

            usuarioBuscado.Senha = Criptografia.GerarHash(senhaNova);

            ctx.Usuario.Update(usuarioBuscado);

            ctx.SaveChanges();

            return true;
        }

        public bool ArquivarOuDesarquivarUsuario(Guid idUsuario)
        {
            Usuario usuarioBuscado = ctx.Usuario.FirstOrDefault(x => x.IdUsuario == idUsuario)!;

            if (usuarioBuscado == null)
            {
                return false;
            }

            usuarioBuscado.IsActive = !usuarioBuscado.IsActive;
            ctx.Usuario.Update(usuarioBuscado);
            ctx.SaveChanges();

            return true;
        }


        public bool AtualizarUsuario(Guid idUsuario, AtualizarUsuario atualizarUsuario)
        {
            Usuario usuarioBuscado = ctx.Usuario.FirstOrDefault(x => x.IdUsuario == idUsuario)!;

            ctx.Update(usuarioBuscado);

            ctx.SaveChanges();

            return true;
        }

        public List<Object> ListarTodosOsUsuarios()
        {
            List<Usuario> usuarios = ctx.Usuario.ToList();

            var estagiarios = ctx.Estagiario
                .Include(e => e.Expediente)
                .Include(e => e.Squad)
                .ToList();

            var squadsGestores = ctx.SquadGestor
                .Include(sg => sg.Squad)
                .ToList();

            List<Object> listaUsuarios = [];

            foreach (var usuario in usuarios)
            {


                switch ((RoleEnum)usuario.Role)
                {
                    case RoleEnum.Administrador:
                        listaUsuarios.Add(new ExibirUsuario
                        {
                            IdUsuario = usuario.IdUsuario,
                            Nome = usuario.Nome,
                            SobreNome = usuario.SobreNome,
                            EmailPessoal = usuario.EmailPessoal,
                            EmailCorporativo = usuario.EmailCorporativo,
                            Role = RoleEnum.Administrador.ToString(),
                            IsActive = usuario.IsActive
                        });
                        break;

                    case RoleEnum.Gestor:
                        // Obtém os squads relacionados ao gestor
                        var squadsDoGestor = squadsGestores
                            .Where(sg => sg.IdUsuario == usuario.IdUsuario && sg.Squad != null)
                            .Select(sg => new ExibirMinSquad
                            {
                                IdSquad = sg.Squad!.IdSquad,
                                Nome = sg.Squad.Nome
                            })
                            .ToList();

                        listaUsuarios.Add(new ExibirGestor
                        {
                            IdUsuario = usuario.IdUsuario,
                            Nome = usuario.Nome,
                            SobreNome = usuario.SobreNome,
                            EmailPessoal = usuario.EmailPessoal,
                            EmailCorporativo = usuario.EmailCorporativo,
                            Role = RoleEnum.Gestor.ToString(),
                            IsActive = usuario.IsActive,
                            Squads = squadsDoGestor
                        });
                        break;

                    case RoleEnum.Estagiario:
                        var estagiarioData = estagiarios.FirstOrDefault(e => e.IdUsuario == usuario.IdUsuario);
                        if (estagiarioData != null)
                        {
                            listaUsuarios.Add(new ExibirEstagiario
                            {
                                IdUsuario = usuario.IdUsuario,
                                Nome = usuario.Nome,
                                SobreNome = usuario.SobreNome,
                                EmailPessoal = usuario.EmailPessoal,
                                EmailCorporativo = usuario.EmailCorporativo,
                                Role = RoleEnum.Estagiario.ToString(),
                                IsActive = usuario.IsActive,
                                IsBolsista = estagiarioData.IsBolsista,
                                Matrícula = estagiarioData.Matrícula,
                                Squad = estagiarioData.Squad != null ? new ExibirMinSquad
                                {
                                    IdSquad = estagiarioData.Squad.IdSquad,
                                    Nome = estagiarioData.Squad.Nome
                                } : null,
                                InicioExpediente = estagiarioData.Expediente?.InicioExpediente,
                                FimExpediente = estagiarioData.Expediente?.FimExpediente
                            });
                        }
                        break;
                }
            }

            return listaUsuarios;
        }

        public List<object> ListarEstagiariosDoGestor(Guid idGestor)
        {
            // Obtém os IDs de todos os squads associados ao gestor
            var idSquads = ctx.SquadGestor
                              .Where(sg => sg.IdUsuario == idGestor)
                              .Select(sg => sg.IdSquad)
                              .ToList();

            if (!idSquads.Any())
            {
                // Retorna uma lista vazia caso o gestor não esteja associado a nenhum squad
                return new List<object>();
            }

            // Filtra os estagiários que estão nos squads encontrados
            var estagiarios = ctx.Estagiario
                .Include(x => x.Usuario)
                                 .Where(e => idSquads.Contains(e.IdSquad))
                                 .Select(e => new
                                 {
                                     e.IdEstagiario,
                                     Nome = e.Usuario!.Nome,
                                     Sobrenome = e.Usuario!.SobreNome
                                 })
                                 .ToList<object>();

            return estagiarios;
        }


    }
}
