using web_api_checkpoint.Domains;
using web_api_checkpoint.ViewModels.Notificacao;

namespace web_api_checkpoint.Interfaces
{
    public interface INotificacaoRepository
    {
        Task CadastrarNotificacao(Notificacao notificacao);
        Task<List<ExibirNotificacao>> BuscarNotificacoesDoUsuario(Guid idUsuario);
    }
}
