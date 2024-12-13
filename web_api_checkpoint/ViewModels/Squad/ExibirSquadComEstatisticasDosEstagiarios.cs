using web_api_checkpoint.ViewModels.Usuario;
using web_api_checkpoint.ViewModels.Usuario.Estagiario;

namespace web_api_checkpoint.ViewModels.Squad
{
    public class ExibirSquadComEstatisticasDosEstagiarios : ExibirMinSquad
    {
        public List<ExibirUsuario> Gestores { get; set; } = [];
        public List<ExibirEstatisticasEstagiarioParaOSquad> Estagiarios { get; set; } = [];
    }
}
