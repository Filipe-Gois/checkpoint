using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using web_api_checkpoint.Contexts;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Hubs;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.ViewModels.Justificativa;
using web_api_checkpoint.ViewModels.JustificativaFalta;
using WebAPI.Utils.BlobStorage;

namespace web_api_checkpoint.Repositories
{
    public class JustificativaFaltaRepository : IJustificativaFaltaRepository
    {

        private readonly CheckpointContext ctx;
        private readonly IHubProvider _hubContext;

        public JustificativaFaltaRepository(CheckpointContext _ctx, IHubProvider hubContext)
        {
            ctx = _ctx;
            _hubContext = hubContext;
        }
        public async Task<bool> CadastrarJustificativa(CadastrarJustificativaFalta cadastrarJustificativaFalta)
        {

            Presenca presencaBuscada = ctx.Presenca
                .Include(x => x.CalendarioLetivo)
                .Include(x => x.Estagiario).ThenInclude(x => x!.Usuario)
                .Include(x => x.CalendarioLetivo)
                .FirstOrDefault(x => cadastrarJustificativaFalta.IdEstagiario == x.IdEstagiario && x.CalendarioLetivo!.Data == cadastrarJustificativaFalta.Data)!;

            JustificativaFalta justificativaFaltaBuscada = ctx.JustificativaFalta.Include(x => x.Presenca).FirstOrDefault(x => x.IdPresenca == presencaBuscada.IdPresenca)!;

            if (presencaBuscada == null || presencaBuscada.HorarioEntrada != null || presencaBuscada.HorarioSaida != null || justificativaFaltaBuscada != null) return false;

            List<Guid?> idAdministradores = ctx.Usuario
    .Where(x => x.Role == 0)
    .Select(x => (Guid?)x.IdUsuario)  // Converte de Guid para Guid?
    .ToList();


            Midia midia = await AzureBlobStorageHelper.UploadImageBlobAsync(cadastrarJustificativaFalta.Arquivo!);

            JustificativaFalta justificativaFalta = new()
            {
                IdMidia = midia.IdMidia,
                IdPresenca = presencaBuscada.IdPresenca,
            };

            ctx.Midia.Add(midia);
            ctx.JustificativaFalta.Add(justificativaFalta);

            ctx.SaveChanges();

            Notificacao notificacao = new()
            {
                Titulo = "Justificativa de falta.",
                Descricao = $"O estagiário {presencaBuscada.Estagiario!.Usuario!.Nome + " " + presencaBuscada.Estagiario!.Usuario!.SobreNome} anexou um arquivo para justificar a falta referente ao dia {presencaBuscada.CalendarioLetivo!.Data.ToString("dd/MM/yyyy")}",
                IdDestinatarios = idAdministradores,
                TipoNotificacao = (int)NotificacaoEnum.EnvioDeJustificativaDeFalta,

            };

            await _hubContext.EnviarNotificacao(notificacao);

            return true;
        }

        public List<ExibirJustificativaFalta> ListarTodasAsJustificativasDeFalta()
        {

            Type statusValidacaoEnum = typeof(StatusValidacaoEnum);

            return ctx.JustificativaFalta
                .Include(x => x.Midia)
                .Include(x => x.Presenca).ThenInclude(x => x!.CalendarioLetivo)
                .Include(x => x.Presenca!.Estagiario).ThenInclude(x => x!.Usuario)
                .Select(x => new ExibirJustificativaFalta
                {
                    IdJustificativaFalta = x.IdJustificativaFalta,
                    Data = x.Presenca!.CalendarioLetivo!.Data,
                    Matrícula = x.Presenca.Estagiario!.Matrícula,
                    MotivoRejeicao = x.MotivoRejeicao ?? null,
                    UrlArquivo = x.Midia!.Url,
                    StatusValidacao = Enum.GetName(statusValidacaoEnum, x.StatusValidacao),
                    Nome = x.Presenca.Estagiario.Usuario!.Nome,
                    SobreNome = x.Presenca.Estagiario.Usuario.SobreNome,
                }).ToList();

        }

        public async Task<bool> ValidarJustificativa(ValidarJustificativaFalta validarJustificativaFalta)
        {
            JustificativaFalta justificativaFaltaBuscada = ctx.JustificativaFalta
                .Include(x => x.Presenca).ThenInclude(x => x!.CalendarioLetivo)
                .FirstOrDefault(x => validarJustificativaFalta.IdJustificativaFalta == x.IdJustificativaFalta)!;

            if (justificativaFaltaBuscada == null || validarJustificativaFalta.StatusValidacao == (int)StatusValidacaoEnum.Pendente)
            {
                return false;
            }
            justificativaFaltaBuscada.MotivoRejeicao = null;

            if (validarJustificativaFalta.StatusValidacao == (int)StatusValidacaoEnum.Rejeitado)
            {
                justificativaFaltaBuscada.MotivoRejeicao = validarJustificativaFalta.MotivoRejeicao;
            }

            justificativaFaltaBuscada.StatusValidacao = validarJustificativaFalta.StatusValidacao;



            ctx.JustificativaFalta.Update(justificativaFaltaBuscada);

            ctx.SaveChanges();

            Notificacao notificacao = new()
            {
                Descricao = $"Sua justificativa de falta para o dia {justificativaFaltaBuscada.Presenca!.CalendarioLetivo!.Data.ToString("dd/MM/yyyy")} foi {(validarJustificativaFalta.StatusValidacao == (int)StatusValidacaoEnum.Aprovado ? "aprovada" : "reprovada")}.",
                Titulo = "Validação de justificativa de falta.",
                IdDestinatarios = [justificativaFaltaBuscada.Presenca!.IdEstagiario],
                TipoNotificacao = (int)NotificacaoEnum.ValidacaoDeJustificativaDeFalta,
            };

            await _hubContext.EnviarNotificacao(notificacao);

            return true;
        }
    }
}
