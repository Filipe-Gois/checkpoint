using web_api_checkpoint.ViewModels.Pontuacao;
using web_api_checkpoint.ViewModels.Usuario.Estagiario;

namespace web_api_checkpoint.ViewModels.Squad
{
    public class ExibirEstatisticasSquad
    {
        public Guid? IdSquad { get; set; }
        public string? Nome { get; set; }
        public List<string> Gestores { get; set; } = [];
        public List<ExibirPontuacao> EstagiariosPontuacao { get; set; } = [];
    }
}
