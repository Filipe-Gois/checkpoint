using web_api_checkpoint.ViewModels.Usuario.Estagiario;
using web_api_checkpoint.ViewModels.Usuario.Gestor;

namespace web_api_checkpoint.ViewModels.Squad
{
    public class AtualizarSquad
    {
        public string? Nome { get; set; }
        public List<Guid> IdGestores { get; set; } = [];
        public List<Guid> IdEstagiarios { get; set; } = [];
    }
}
