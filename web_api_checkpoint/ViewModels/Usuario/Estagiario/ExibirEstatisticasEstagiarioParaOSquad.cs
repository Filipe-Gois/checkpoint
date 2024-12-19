using web_api_checkpoint.ViewModels.Pontuacao;
using web_api_checkpoint.ViewModels.Presenca;

namespace web_api_checkpoint.ViewModels.Usuario.Estagiario
{
    public class ExibirEstatisticasEstagiarioParaOSquad
    {
        public ExibirResumoPresenca? Presencas { get; set; }
        public TimeOnly? InicioExpediente { get; set; }
        public TimeOnly? FimExpediente { get; set; }
        public string? Matrícula { get; set; }
        public Guid idEstagiario { get; set; }
        public string? Nome { get; set; }
        public string? SobreNome { get; set; }
        public List<ExibirPontuacao> EstagiariosPontuacao { get; set; } = [];
    }
}
