using web_api_checkpoint.ViewModels.Pontuacao;
using web_api_checkpoint.ViewModels.Presenca;
using web_api_checkpoint.ViewModels.Squad;

namespace web_api_checkpoint.ViewModels.Usuario.Estagiario
{
    public class ExibirEstatisticasEstagiario
    {
        public ExibirResumoPresenca? Presencas { get; set; }
        public TimeOnly? InicioExpediente { get; set; }
        public TimeOnly? FimExpediente { get; set; }
        public string? Matrícula { get; set; }
        public ExibirEstatisticasSquad? Squad { get; set; }
    }
}
