using web_api_checkpoint.ViewModels.Usuario.Estagiario;
using web_api_checkpoint.ViewModels.Usuario.Gestor;

namespace web_api_checkpoint.ViewModels.Squad
{
    public class ExibirSquad
    {
        public Guid? IdSquad { get; set; }
        public string? Nome { get; set; }
        public List<ExibirGestor> Gestores { get; set; } = [];
        public List<ExibirEstagiario> Estagiarios { get; set; } = [];
    }
}
