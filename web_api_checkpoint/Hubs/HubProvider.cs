
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.ViewModels.Notificacao;

namespace web_api_checkpoint.Hubs
{
    public class HubProvider : Hub<IHubProvider>
    {
        
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

            await Clients.Users(idDestinatariosString).ReceberNotificacao(exibirNotificacao);
        }

    }
}
