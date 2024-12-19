using web_api_checkpoint.ViewModels.Presenca;
using web_api_checkpoint.ViewModels.Squad;

namespace web_api_checkpoint.ViewModels.Usuario.Estagiario
{
    public class ExibirEstagiario : ExibirUsuario
    {
        public bool IsBolsista { get; set; }
        public double Pontuacao { get; set; }
        public TimeOnly? InicioExpediente { get; set; }
        public TimeOnly? FimExpediente { get; set; }
        public string? Matrícula { get; set; }
        public ExibirMinSquad? Squad { get; set; }
        public List<ExibirPresenca>? Presencas { get; set; }

    }
}
