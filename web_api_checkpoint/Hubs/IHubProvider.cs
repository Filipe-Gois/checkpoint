using web_api_checkpoint.Domains;
using web_api_checkpoint.ViewModels.Notificacao;

namespace web_api_checkpoint.Hubs
{
    public interface IHubProvider
    {
        Task ReceberNotificacao(ExibirNotificacao notificacao);
        Task EnviarNotificacao(Notificacao notificacao);
    }
}
