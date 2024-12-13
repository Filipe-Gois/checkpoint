using web_api_checkpoint.ViewModels.Tarefa;

namespace web_api_checkpoint.Interfaces
{
    public interface ITarefaRepository
    {
        List<ExibirTarefa> ListarTarefasDoEstagiario(Guid idEstagiario);
        List<ExibirTarefa> ListarTodasAsTarefas();
        Task<bool> CadastrarTarefa(CadastrarTarefa cadastrarTarefa);
        Task<bool> EntregarTarefa(Guid idTarefa, List<IFormFile> arquivos);
        Task<bool> AtualizarTarefa(Guid id, AtualizarTarefa atualizarTarefa);
        Task<bool> AtualizarEntregaTarefa(Guid id, List<IFormFile> arquivos);
        bool ArquivarOuDesarquivarTarefa(Guid id);
        Task<bool> CorrigirTarefa(Guid idTarefa, int statusCorrecao, string descricaoCorrecao);
        List<ExibirTarefaCorrecao> ListarTarefasParaOsGestores(Guid idGestor);
    }
}
