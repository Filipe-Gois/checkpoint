using Microsoft.EntityFrameworkCore;
using web_api_checkpoint.Contexts;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.ViewModels.Presenca;

namespace web_api_checkpoint.Repositories
{
    public class PresencaRepository : IPresencaRepository
    {
        private readonly CheckpointContext ctx;

        public PresencaRepository(CheckpointContext _ctx)
        {
            ctx = _ctx;
        }

        public void GerarPresenca()
        {
            DateTime dataAtual = DateTime.Now.Date;

            CalendarioLetivo calendarioLetivoBuscado = ctx.CalendarioLetivo.FirstOrDefault(x => x.Data.Date == dataAtual)!;

            if (calendarioLetivoBuscado != null)
            {
                return;
            }

            CalendarioLetivo novoCalendarioLetivo = new();

            ctx.CalendarioLetivo.Add(novoCalendarioLetivo);

            List<Estagiario> estagiarios = ctx.Estagiario.ToList();

            if (novoCalendarioLetivo.IsDiaLetivo)
            {
                foreach (var estagiario in estagiarios)
                {
                    Presenca presencasBuscada = ctx.Presenca.Include(x => x.CalendarioLetivo).FirstOrDefault(x => x.CalendarioLetivo!.Data.Date == dataAtual && x.IdEstagiario == estagiario.IdEstagiario)!;

                    if (presencasBuscada == null)
                    {

                        Presenca presenca = new()
                        {
                            IdCalendarioLetivo = novoCalendarioLetivo.IdCalendarioLetivo,
                            IdEstagiario = estagiario.IdEstagiario,
                        };

                        ctx.Presenca.Add(presenca);
                    }
                }
            }



            ctx.SaveChanges();
        }

        public List<ExibirPresenca> ListarPresencasDoEstagiario(Guid id)
        {
            List<Presenca> presencasBuscadas = ctx.Presenca
                .Include(x => x.Estagiario).ThenInclude(x => x!.Usuario)
                .Include(x => x.CalendarioLetivo)
                .Where(x => x.IdEstagiario == id && x.CalendarioLetivo!.IsDiaLetivo)
                .ToList();

            List<ExibirPresenca> presencasFormatadas = new();

            foreach (Presenca presenca in presencasBuscadas)
            {
                ExibirPresenca exibirPresenca = new()
                {
                    IdPresenca = presenca.IdPresenca,
                    HorarioEntrada = presenca.HorarioEntrada,
                    HorarioSaida = presenca.HorarioSaida,
                    Data = presenca.CalendarioLetivo!.Data,
                };

                presencasFormatadas.Add(exibirPresenca);
            }

            return presencasFormatadas;
        }

        public bool BaterPontoSaida(Guid idEstagiario)
        {
            DateTime dataHoraAtual = DateTime.Now;
            Presenca presencaBuscada = ctx.Presenca.Include(x => x.CalendarioLetivo).FirstOrDefault(x => x.IdEstagiario == idEstagiario && x.CalendarioLetivo!.Data.Date == dataHoraAtual.Date)!;

            Estagiario estagiarioBuscado = ctx.Estagiario.Include(x => x.Expediente).FirstOrDefault(x => x.IdEstagiario == idEstagiario)!;

            if (presencaBuscada != null && dataHoraAtual.TimeOfDay <= estagiarioBuscado.Expediente!.FimExpediente.ToTimeSpan())
            //&& presencaBuscada.HorarioSaida == null
            {
                presencaBuscada!.HorarioSaida = TimeOnly.FromDateTime(dataHoraAtual);
                ctx.Presenca.Update(presencaBuscada);
                ctx.SaveChanges();

                return true;
            }

            return false;
        }

        public List<DateTime> ListarFaltasNaoJustificadasDoEstagiarioNosUltimos30Dias(Guid idEstagiario)
        {
            DateTime trintaDiasAtras = DateTime.Now.AddDays(-30);

            List<DateTime> faltas = ctx.Presenca
                .Include(x => x.CalendarioLetivo)
                .Where(x => x.HorarioEntrada == null
                            && x.HorarioSaida == null
                            && x.IdEstagiario == idEstagiario
                            && x.CalendarioLetivo!.Data >= trintaDiasAtras
                            && !ctx.JustificativaFalta.Any(j => j.IdPresenca == x.IdPresenca)).Select(s => s.CalendarioLetivo.Data)
                .ToList();

            return faltas;
        }

    }
}
