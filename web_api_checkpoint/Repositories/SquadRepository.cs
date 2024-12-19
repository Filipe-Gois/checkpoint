using Microsoft.EntityFrameworkCore;
using web_api_checkpoint.Contexts;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.ViewModels.Pontuacao;
using web_api_checkpoint.ViewModels.Presenca;
using web_api_checkpoint.ViewModels.Squad;
using web_api_checkpoint.ViewModels.Usuario;
using web_api_checkpoint.ViewModels.Usuario.Estagiario;
using web_api_checkpoint.ViewModels.Usuario.Gestor;

namespace web_api_checkpoint.Repositories
{
    public class SquadRepository : ISquadRepository
    {

        CheckpointContext ctx;
        public SquadRepository(CheckpointContext _ctx)
        {
            ctx = _ctx;
        }

        public bool ArquivarOuDesarquivarSquad(Guid idSquad)
        {

            Squad squadBuscado = ctx.Squad.FirstOrDefault(x => x.IdSquad == idSquad)!;

            if (squadBuscado == null) return false;

            squadBuscado.IsActive = !squadBuscado.IsActive;
            ctx.Update(squadBuscado);
            ctx.SaveChanges();

            return true;
        }

        public bool AtualizarSquad(Guid idSquad, AtualizarSquad squad)
        {
            // Busca o Squad existente
            Squad squadBuscado = ctx.Squad.FirstOrDefault(x => x.IdSquad == idSquad)!;
            if (squadBuscado == null || squad.IdEstagiarios.Count > 6)
            {
                return false;
            }

            squadBuscado.Nome = squad.Nome ?? squadBuscado.Nome;

            // Atualiza os Gestores
            var squadGestoresExistentes = ctx.SquadGestor.Where(x => x.IdSquad == idSquad).ToList();

            // Remove os gestores que não estão na nova lista
            foreach (var gestorExistente in squadGestoresExistentes)
            {
                if (!squad.IdGestores.Contains(gestorExistente.IdUsuario!.Value))
                {
                    ctx.SquadGestor.Remove(gestorExistente);
                }
            }

            // Adiciona novos gestores
            foreach (var idGestor in squad.IdGestores)
            {
                if (!squadGestoresExistentes.Any(x => x.IdUsuario == idGestor))
                {
                    ctx.SquadGestor.Add(new SquadGestor { IdUsuario = idGestor, IdSquad = idSquad });
                }
            }

            // Atualiza os Estagiários
            var estagiariosExistentes = ctx.Estagiario.Where(x => x.IdSquad == idSquad).ToList();

            // Remove os estagiários que não estão na nova lista
            foreach (var estagiarioExistente in estagiariosExistentes)
            {
                if (!squad.IdEstagiarios.Contains(estagiarioExistente.IdEstagiario))
                {
                    estagiarioExistente.IdSquad = null; // Remove o estagiário do squad
                }
            }

            // Adiciona novos estagiários
            foreach (var idEstagiario in squad.IdEstagiarios)
            {
                if (!estagiariosExistentes.Any(x => x.IdEstagiario == idEstagiario))
                {
                    var estagiario = ctx.Estagiario.FirstOrDefault(x => x.IdEstagiario == idEstagiario);
                    if (estagiario != null)
                    {
                        estagiario.IdSquad = idSquad; // Atribui o estagiário ao novo squad
                    }
                }
            }

            // Salva as mudanças no contexto
            ctx.SaveChanges();
            return true;
        }


        public bool CadastrarSquad(CadastrarSquad squad)
        {
            Squad squadBuscado = ctx.Squad.FirstOrDefault(x => x.Nome == squad.Nome)!;

            //cria squads com no máximo 6 estagiários
            if (squadBuscado != null || squad.IdEstagiarios.Count > 6) return false;

            Squad novoSquad = new()
            {
                Nome = squad.Nome,
            };

            ctx.Squad.Add(novoSquad);

            foreach (var idGestor in squad.IdGestores)
            {
                SquadGestor novoSquadGestor = new()
                {
                    IdUsuario = idGestor,
                    IdSquad = novoSquad.IdSquad
                };

                ctx.SquadGestor.Add(novoSquadGestor);
            }

            foreach (var idEstagiario in squad.IdEstagiarios)
            {
                Estagiario estagiario = ctx.Estagiario.FirstOrDefault(x => x.IdEstagiario == idEstagiario)!;

                if (estagiario != null)
                {
                    if (estagiario.IdSquad != null)
                    {
                        return false;
                    }


                    estagiario.IdSquad = novoSquad.IdSquad;
                    ctx.Estagiario.Update(estagiario);
                }

            }

            ctx.SaveChanges();

            return true;
        }

        public List<ExibirSquadComEstatisticasDosEstagiarios> ListarSquadsComEstatisticasDosEstagiarios()
        {
            // Lista de squads para retorno
            List<ExibirSquadComEstatisticasDosEstagiarios> squadsComEstatisticas = [];

            // Buscando todos os SquadGestor com as informações necessárias
            var squadGestors = ctx.SquadGestor
                .Include(x => x.Squad)
                .Include(x => x.Usuario)
                .Where(x => x.Squad!.IsActive == true)
                .ToList();

            // Agrupando por Squad
            var gruposPorSquad = squadGestors.GroupBy(x => x.Squad);

            // Para cada grupo de Squad, popular as informações
            foreach (var grupo in gruposPorSquad)
            {
                var squadAtual = grupo.Key!;
                var estagiarios = ctx.Estagiario
                    .Include(e => e.Expediente)
                    .Include(e => e.Usuario)
                    .Where(e => e.IdSquad == squadAtual.IdSquad && e.Usuario!.IsActive == true)
                    .ToList();

                // Construção da lista de estatísticas dos estagiários
                var estatisticasEstagiarios = estagiarios.Select(estagiario =>
                {
                    var seisMesesAtras = DateTime.Now.AddMonths(-6);

                    // Resumo das presenças
                    var presencas = ctx.Presenca
                        .Where(p => p.IdEstagiario == estagiario.IdEstagiario && p.CalendarioLetivo!.Data >= seisMesesAtras)
                        .ToList();

                    var resumoPresenca = new ExibirResumoPresenca
                    {
                        DiasLetivos = presencas.Count,
                        TotalPresencas = presencas.Count(p =>
                            p.HorarioEntrada != null &&
                            p.HorarioEntrada <= estagiario.Expediente!.InicioExpediente.AddMinutes(5)),
                        TotalFaltas = presencas.Count(p => p.HorarioEntrada == null && p.HorarioSaida == null),
                        TotalAtrasos = presencas.Count(p =>
                            p.HorarioEntrada != null &&
                            p.HorarioEntrada > estagiario.Expediente!.InicioExpediente.AddMinutes(5))
                    };

                    // Pontuações do estagiário
                    var pontuacaoSquad = ctx.Tarefa
                    .Include(x => x.Estagiario).ThenInclude(x => x.Usuario)
                        .Where(t => t.IdEstagiario == estagiario.IdEstagiario && t.Prazo >= seisMesesAtras)
                        .Where(t => t.StatusCorrecao != (int)StatusCorrecaoEnum.Pendente)
                        .GroupBy(t => new { t.Prazo.Month, t.Prazo.Year, t.Estagiario!.Usuario!.Nome, t.Estagiario.Usuario.SobreNome })
                        .Select(g => new ExibirPontuacao
                        {
                            IdSquad = estagiario.IdSquad,
                            IdEstagiario = estagiario.IdEstagiario,
                            Mes = g.Key.Month,
                            Ano = g.Key.Year,
                            Nome = g.Key.Nome,
                            SobreNome = g.Key.SobreNome,
                            PontuacaoTotal = g.Sum(t =>
                                t.StatusCorrecao == (int)StatusCorrecaoEnum.EmAnalise ? t.Dificuldade :
                                t.StatusCorrecao == (int)StatusCorrecaoEnum.Certa ? t.Dificuldade * 2 :
                                t.StatusCorrecao == (int)StatusCorrecaoEnum.Errada ? t.Dificuldade : 0)
                        })
                        .ToList();

                    return new ExibirEstatisticasEstagiarioParaOSquad
                    {
                        Presencas = resumoPresenca,
                        Matrícula = estagiario.Matrícula,
                        InicioExpediente = estagiario.Expediente?.InicioExpediente,
                        FimExpediente = estagiario.Expediente?.FimExpediente,
                        EstagiariosPontuacao = pontuacaoSquad,
                        Nome = estagiario.Usuario!.Nome,
                        SobreNome = estagiario.Usuario.SobreNome,
                        idEstagiario = estagiario.IdEstagiario

                    };
                }).ToList();

                // Construindo o retorno para o squad atual
                squadsComEstatisticas.Add(new ExibirSquadComEstatisticasDosEstagiarios
                {
                    IdSquad = squadAtual.IdSquad,
                    Nome = squadAtual.Nome,
                    Gestores = grupo.Select(g => new ExibirUsuario
                    {
                        IdUsuario = g.Usuario!.IdUsuario,
                        Nome = g.Usuario!.Nome,
                        SobreNome = g.Usuario.SobreNome,
                        EmailPessoal = g.Usuario.EmailPessoal,
                        EmailCorporativo = g.Usuario.EmailCorporativo,
                        Role = RoleEnum.Gestor.ToString(),
                        IsActive = g.Usuario.IsActive
                    }).ToList(),
                    Estagiarios = estatisticasEstagiarios
                });
            }

            return squadsComEstatisticas;
        }


        public List<ExibirSquad> ListarSquadsDoGestor(Guid idGestor)
        {
            // Criação da lista de squads a serem retornados
            List<ExibirSquad> squads = [];

            // Buscando todos os SquadGestor com as informações necessárias
            List<SquadGestor> squadGestors = ctx.SquadGestor
                .Include(x => x.Squad)
                .Include(x => x.Usuario)
                .Where(x => x.Squad!.IsActive == true && x.IdUsuario == idGestor)
                .ToList();

            // Agrupando por Squad
            var gruposPorSquad = squadGestors.GroupBy(x => x.Squad);

            // Para cada grupo de Squad, popular as informações de ExibirSquad
            foreach (var grupo in gruposPorSquad)
            {
                // Criação de um novo ExibirSquad
                ExibirSquad squad = new()
                {
                    IdSquad = grupo.Key!.IdSquad,
                    Nome = grupo.Key!.Nome,
                    Gestores = grupo.Select(g => new ExibirGestor
                    {
                        IdUsuario = g!.IdUsuario,
                        Nome = g.Usuario!.Nome,
                        SobreNome = g.Usuario.SobreNome,
                        EmailPessoal = g.Usuario.EmailPessoal,
                        EmailCorporativo = g.Usuario.EmailCorporativo,
                        Role = RoleEnum.Gestor.ToString(),
                        IsActive = g.Usuario.IsActive
                    }).ToList(),
                    Estagiarios = ctx.Estagiario
                    .Include(x => x.Expediente)
                        .Where(e => e.IdSquad == grupo.Key!.IdSquad && e.Usuario!.IsActive == true)
                        .Select(e => new ExibirEstagiario
                        {
                            IdUsuario = e.Usuario!.IdUsuario,
                            Nome = e.Usuario.Nome,
                            SobreNome = e.Usuario.SobreNome,
                            EmailPessoal = e.Usuario.EmailPessoal,
                            EmailCorporativo = e.Usuario.EmailCorporativo,
                            Role = RoleEnum.Estagiario.ToString(),
                            Matrícula = e.Matrícula,
                            IsBolsista = e.IsBolsista,
                            InicioExpediente = e.Expediente!.InicioExpediente,
                            FimExpediente = e.Expediente.FimExpediente,
                            IsActive = e.Usuario.IsActive
                        }).ToList()
                };

                squads.Add(squad);
            }

            return squads;
        }

        public List<ExibirSquad> ListarTodosOsSquads()
        {
            // Criação da lista de squads a serem retornados
            List<ExibirSquad> squads = [];

            // Buscando todos os SquadGestor com as informações necessárias
            List<SquadGestor> squadGestors = ctx.SquadGestor
                .Include(x => x.Squad)
                .Include(x => x.Usuario)
                .Where(x => x.Squad!.IsActive == true)
                .ToList();

            // Agrupando por Squad
            var gruposPorSquad = squadGestors.GroupBy(x => x.Squad);

            // Para cada grupo de Squad, popular as informações de ExibirSquad
            foreach (var grupo in gruposPorSquad)
            {
                // Criação de um novo ExibirSquad
                ExibirSquad squad = new()
                {
                    IdSquad = grupo.Key!.IdSquad,
                    Nome = grupo.Key!.Nome,
                    Gestores = grupo.Select(g => new ExibirGestor
                    {
                        IdUsuario = g!.IdUsuario,
                        Nome = g.Usuario!.Nome,
                        SobreNome = g.Usuario.SobreNome,
                        EmailPessoal = g.Usuario.EmailPessoal,
                        EmailCorporativo = g.Usuario.EmailCorporativo,
                        Role = RoleEnum.Gestor.ToString(),
                        IsActive = g.Usuario.IsActive
                    }).ToList(),
                    Estagiarios = ctx.Estagiario
                    .Include(x => x.Expediente)
                        .Where(e => e.IdSquad == grupo.Key!.IdSquad && e.Usuario!.IsActive == true)
                        .Select(e => new ExibirEstagiario
                        {
                            IdUsuario = e.Usuario!.IdUsuario,
                            Nome = e.Usuario.Nome,
                            SobreNome = e.Usuario.SobreNome,
                            EmailPessoal = e.Usuario.EmailPessoal,
                            EmailCorporativo = e.Usuario.EmailCorporativo,
                            Role = RoleEnum.Estagiario.ToString(),
                            Matrícula = e.Matrícula,
                            IsBolsista = e.IsBolsista,
                            InicioExpediente = e.Expediente!.InicioExpediente,
                            FimExpediente = e.Expediente.FimExpediente,
                            IsActive = e.Usuario.IsActive
                        }).ToList()
                };

                squads.Add(squad);
            }

            return squads;
        }

    }
}
