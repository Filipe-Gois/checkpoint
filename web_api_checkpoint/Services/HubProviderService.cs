using Microsoft.AspNetCore.SignalR;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Hubs;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.ViewModels.Notificacao;

namespace web_api_checkpoint.Services
{
    public class HubProviderService : IHubProvider
    {
        private readonly IHubContext<HubProvider> _hubContext;
        private readonly INotificacaoRepository _notificacaoRepository;

        public HubProviderService(IHubContext<HubProvider> hubContext, INotificacaoRepository notificacaoRepository)
        {
            _hubContext = hubContext;
            _notificacaoRepository = notificacaoRepository;
        }


        public async Task EnviarNotificacao(Notificacao notificacao)
        {
            List<string> idDestinatariosString = notificacao.IdDestinatarios.Select(id => id.ToString()).ToList()!;

            ExibirNotificacao exibirNotificacao = new()
            {
                IdNotificacao = notificacao.IdNotificacao,
                DataEHora = notificacao.DataEHora,
                Descricao = notificacao.Descricao,
                Titulo = notificacao.Titulo,
                IdDestinatarios = notificacao.IdDestinatarios
            };

            await _notificacaoRepository.CadastrarNotificacao(notificacao);

            await _hubContext.Clients.Users(idDestinatariosString).SendAsync("ReceberNotificacao", exibirNotificacao);
        }

        public Task ReceberNotificacao(ExibirNotificacao notificacao)
        {
            throw new NotImplementedException();
        }
    }
}
