using web_api_checkpoint.ViewModels.Squad;

namespace web_api_checkpoint.ViewModels.Usuario.Gestor
{
    public class ExibirGestor : ExibirUsuario
    {
        public List<ExibirMinSquad>? Squads { get; set; }
    }
}