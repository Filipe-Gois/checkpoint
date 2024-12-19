using web_api_checkpoint.ViewModels.Squad;

namespace web_api_checkpoint.Interfaces
{
    public interface ISquadRepository
    {

        bool CadastrarSquad(CadastrarSquad squad);

        /// <summary>
        /// Lista somente os estagiários ativos no sistema
        /// </summary>
        /// <returns></returns>
        List<ExibirSquad> ListarTodosOsSquads();
        List<ExibirSquad> ListarSquadsDoGestor(Guid idGestor);

        /// <summary>
        /// Atualiza todos os itens dentro do squad INCLUINDO OS GESTORES. Somente o adm terá acesso a esse metodo
        /// </summary>
        /// <param name="squad"></param>
        /// <returns></returns>
        bool AtualizarSquad(Guid idSquad, AtualizarSquad squad);

        bool ArquivarOuDesarquivarSquad(Guid idSquad);

        List<ExibirSquadComEstatisticasDosEstagiarios> ListarSquadsComEstatisticasDosEstagiarios();
    }
}
