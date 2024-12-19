using web_api_checkpoint.ViewModels.Ranking;
using web_api_checkpoint.ViewModels.Usuario.Estagiario;

namespace web_api_checkpoint.Interfaces
{
    public interface IEstagiarioRepository
    {
        List<ExibirRanking> ExibirRanking();
        ExibirEstatisticasEstagiario BuscarEstagiario(Guid idEstagiario);
        byte[] GerarRelatorioEstagiario(Guid idEstagiario);
    }
}
