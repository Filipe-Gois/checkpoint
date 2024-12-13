using Microsoft.EntityFrameworkCore;
using System.Drawing;
using System.Linq;
using web_api_checkpoint.Contexts;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.Utils;
using web_api_checkpoint.ViewModels.Pontuacao;
using web_api_checkpoint.ViewModels.Presenca;
using web_api_checkpoint.ViewModels.Ranking;
using web_api_checkpoint.ViewModels.Squad;
using web_api_checkpoint.ViewModels.Usuario;
using web_api_checkpoint.ViewModels.Usuario.Estagiario;

namespace web_api_checkpoint.Repositories
{

    public class EstagiarioRepository : IEstagiarioRepository
    {
        private readonly CheckpointContext ctx;

        public EstagiarioRepository(CheckpointContext _ctx)
        {
            ctx = _ctx;
        }

        public ExibirEstatisticasEstagiario BuscarEstagiario(Guid idEstagiario)
        {
            // Recupera o estagiário com suas relações
            Estagiario estagiario = ctx.Estagiario
                .Include(e => e.Squad)
                .Include(e => e.Expediente)
                .FirstOrDefault(e => e.IdEstagiario == idEstagiario)!;

            if (estagiario == null) return null!;

            var seisMesesAtras = DateTime.Now.AddMonths(-6);

            // 1. Resumo das presenças
            var presencas = ctx.Presenca
                .Where(p => p.IdEstagiario == idEstagiario && p.CalendarioLetivo!.Data >= seisMesesAtras)
                .ToList();

            var diasLetivos = presencas.Count;
            var totalPresencas = presencas.Count(p =>
                p.HorarioEntrada != null &&
                p.HorarioEntrada <= estagiario.Expediente!.InicioExpediente.AddMinutes(5));
            var totalFaltas = presencas.Count(p => p.HorarioEntrada == null && p.HorarioSaida == null);
            var totalAtrasos = presencas.Count(p =>
                p.HorarioEntrada != null &&
                p.HorarioEntrada > estagiario.Expediente!.InicioExpediente.AddMinutes(5));

            ExibirResumoPresenca resumoPresenca = new()
            {
                DiasLetivos = diasLetivos,
                TotalPresencas = totalPresencas,
                TotalFaltas = totalFaltas,
                TotalAtrasos = totalAtrasos
            };

            // 2. Pontuação dos estagiários por mês com nome e sobrenome
            var estagiariosSquad = ctx.Estagiario
                .Include(x => x.Usuario)
                .Where(e => e.IdSquad == estagiario.IdSquad)
                .ToList();

            var pontuacaoSquad = estagiariosSquad.SelectMany(e => ctx.Tarefa
                .Where(t => t.IdEstagiario == e.IdEstagiario && t.Prazo >= seisMesesAtras)
                .Where(t => t.StatusCorrecao != (int)StatusCorrecaoEnum.Pendente)
                .GroupBy(t => new { t.Prazo.Month, t.Prazo.Year, e.Usuario.Nome, e.Usuario.SobreNome, e.IdEstagiario, e.IdSquad })
                .Select(g => new ExibirPontuacao
                {
                    IdSquad = g.Key.IdSquad,
                    IdEstagiario = g.Key.IdEstagiario,
                    Mes = g.Key.Month,
                    Ano = g.Key.Year,
                    Nome = g.Key.Nome,
                    SobreNome = g.Key.SobreNome,
                    PontuacaoTotal = g.Sum(t =>
                        t.StatusCorrecao == (int)StatusCorrecaoEnum.EmAnalise ? t.Dificuldade :
                        t.StatusCorrecao == (int)StatusCorrecaoEnum.Certa ? t.Dificuldade * 2 :
                        t.StatusCorrecao == (int)StatusCorrecaoEnum.Errada ? t.Dificuldade : 0)
                })
                .ToList()
            ).ToList();

            return new ExibirEstatisticasEstagiario
            {
                Matrícula = estagiario.Matrícula,
                InicioExpediente = estagiario.Expediente?.InicioExpediente,
                FimExpediente = estagiario.Expediente?.FimExpediente,
                Presencas = resumoPresenca,
                Squad = new ExibirEstatisticasSquad
                {
                    IdSquad = estagiario.Squad?.IdSquad,
                    Nome = estagiario.Squad?.Nome,
                    EstagiariosPontuacao = pontuacaoSquad
                }
            };
        }





        public List<ExibirRanking> ExibirRanking()
        {
            // Total de dias letivos no calendário
            int totalDiasLetivos = ctx.CalendarioLetivo.Count(c => c.IsDiaLetivo);

            // Data para cálculo da pontuação nos últimos 6 meses
            var seisMesesAtras = DateTime.Now.AddMonths(-6);

            // Construir o ranking
            List<ExibirRanking> ranking = ctx.Estagiario
                .Include(e => e.Usuario)
                .Select(estagiario => new ExibirRanking
                {
                    IdEstagiario = estagiario.IdEstagiario,
                    Nome = estagiario.Usuario!.Nome,
                    SobreNome = estagiario.Usuario.SobreNome,

                    // Cálculo da pontuação do estagiário nos últimos 6 meses
                    Pontuacao = ctx.Tarefa
                        .Where(t => t.IdEstagiario == estagiario.IdEstagiario && t.Prazo >= seisMesesAtras)  // Filtra tarefas dos últimos 6 meses
                        .Select(tarefa => new
                        {
                            // Verifica se a tarefa foi corrigida corretamente
                            CorrecaoCerta = tarefa.Dificuldade *
                                (tarefa.StatusCorrecao == (int)StatusCorrecaoEnum.EmAnalise ? 1 :
                                tarefa.StatusCorrecao == (int)StatusCorrecaoEnum.Errada ? 1 :
            tarefa.StatusCorrecao == (int)StatusCorrecaoEnum.Certa ? 2 : 0)




                        })
                        .Sum(res => res.CorrecaoCerta),  // Soma os valores de pontuação

                    // Cálculo da presença considerando faltas e atrasos
                    Presenca = totalDiasLetivos > 0
                        ? Math.Round(((double)ctx.Presenca
                            .Where(p => p.IdEstagiario == estagiario.IdEstagiario && p.CalendarioLetivo!.IsDiaLetivo)
                            .Where(p => p.HorarioEntrada != null)  // Considera presença somente se a entrada não for nula
                            .Where(p => p.HorarioEntrada <= p.Estagiario.Expediente.InicioExpediente.AddMinutes(5)) // Presente com atraso de até 5 minutos
                            .Select(p => p.CalendarioLetivo!.Data.Date)  // Obtém a data do dia letivo
                            .Distinct()
                            .Count() / totalDiasLetivos * 100), 2)
                        : 0.0
                })
                .OrderByDescending(r => r.Pontuacao)  // Ordena pelo maior pontuação
                .ThenByDescending(r => r.Presenca)   // Em caso de empate na pontuação, ordena por maior presença
                .ToList();

            return ranking;
        }

        public byte[] GerarRelatorioEstagiario(Guid idEstagiario)
        {
            // Buscar o estagiário
            Estagiario estagiario = ctx.Estagiario
                .Include(x => x.Expediente)
                .Include(x => x.Squad)
                .Include(x => x.Usuario)
                .FirstOrDefault(x => x.IdEstagiario == idEstagiario)!;

            if (estagiario == null) return null;

            // Definir intervalo fixo de 6 meses
            DateTime dataInicial = DateTime.Now.AddMonths(-6);
            //retorna o último dia do mês
            DateTime dataFinal = new(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month));

            // Obter presenças e tarefas
            List<Presenca> presencas = ObterPresencas(idEstagiario, dataInicial, dataFinal);
            List<Tarefa> tarefas = ObterTarefas(idEstagiario, dataInicial, dataFinal);

            // Gerar lista de todos os meses dos últimos 6 meses
            List<ExibirDadosPorMes> dadosPorMes = Enumerable.Range(0, 6)
                .Select(i => DateTime.Now.AddMonths(-5 + i))
                .Select(data =>
                {
                    int mes = data.Month;
                    int ano = data.Year;

                    // Filtrar presenças do mês
                    var presencasMes = presencas.Where(p =>
                        p.CalendarioLetivo?.Data.Month == mes &&
                        p.CalendarioLetivo.Data.Year == ano);

                    // Filtrar tarefas do mês
                    var tarefasMes = tarefas.Where(t =>
                        t.Prazo.Month == mes &&
                        t.Prazo.Year == ano);

                    // Calcular pontuação total do mês
                    int pontuacaoTotalMes = tarefasMes.Sum(tarefa =>
                        tarefa.StatusCorrecao switch
                        {
                            (int)StatusCorrecaoEnum.EmAnalise => tarefa.Dificuldade,
                            (int)StatusCorrecaoEnum.Certa => tarefa.Dificuldade * 2,
                            (int)StatusCorrecaoEnum.Errada => tarefa.Dificuldade,
                            _ => 0
                        });

                    return new ExibirDadosPorMes
                    {
                        MesAno = new DateTime(ano, mes, 1),
                        TotalPresencas = presencasMes.Count(p => p.HorarioEntrada.HasValue),
                        TotalFaltas = presencasMes.Count(p => !p.HorarioEntrada.HasValue),
                        TotalAtrasos = presencasMes.Count(p =>
                            p.HorarioEntrada.HasValue &&
                            p.HorarioEntrada > p.Estagiario?.Expediente?.InicioExpediente.AddMinutes(5)),
                        PontuacaoTotal = pontuacaoTotalMes
                    };
                })
                .ToList();

            // Construir o relatório
            ExibirRelatorioEstagiario relatorio = new()
            {
                NomeCompleto = estagiario.Usuario!.Nome + " " + estagiario.Usuario!.SobreNome,
                EmailCorporativo = estagiario.Usuario.EmailCorporativo,
                EmailPessoal = estagiario.Usuario.EmailPessoal,
                Matrícula = estagiario.Matrícula,
                SquadNome = estagiario.Squad != null ? estagiario.Squad!.Nome : "Estagiário não possui squad.",
                FimExpediente = estagiario.Expediente!.FimExpediente,
                InicioExpediente = estagiario.Expediente.InicioExpediente,
                DiasLetivos = presencas.Count,
                TotalPresencas = dadosPorMes.Sum(d => d.TotalPresencas),
                TotalFaltas = dadosPorMes.Sum(d => d.TotalFaltas),
                TotalAtrasos = dadosPorMes.Sum(d => d.TotalAtrasos),
                TotalPontuacao = dadosPorMes.Sum(d => d.PontuacaoTotal),
            };

            return PdfHelper.GerarRelatorioEstagiarioPdf(relatorio, dadosPorMes);
        }


        private List<Presenca> ObterPresencas(Guid idEstagiario, DateTime dataInicial, DateTime dataFinal)
        {
            return ctx.Presenca
                .Where(p => p.IdEstagiario == idEstagiario && p.CalendarioLetivo!.Data >= dataInicial && p.CalendarioLetivo.Data <= dataFinal)
                .Include(p => p.CalendarioLetivo)
                .Include(p => p.Estagiario)
                .ThenInclude(e => e!.Expediente)
                .ToList();
        }

        private List<Tarefa> ObterTarefas(Guid idEstagiario, DateTime dataInicial, DateTime dataFinal)
        {
            return ctx.Tarefa
                .Where(t => t.IdEstagiario == idEstagiario && t.Prazo >= dataInicial && t.Prazo <= dataFinal)
                .ToList();
        }


    }
}
