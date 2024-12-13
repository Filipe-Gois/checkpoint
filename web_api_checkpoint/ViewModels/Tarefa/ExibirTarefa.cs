using System.ComponentModel.DataAnnotations.Schema;
using web_api_checkpoint.Domains;

namespace web_api_checkpoint.ViewModels.Tarefa
{
    public class ExibirTarefa
    {
        public Guid IdTarefa { get; set; }
        public string? Titulo { get; set; }
        public string? Descricao { get; set; }
        public string? DescricaoCorrecao { get; set; }
        public DateTime? Prazo { get; set; }
        public string? Dificuldade { get; set; }
        public string? Status { get; set; }
        public List<string>? UrlMidias { get; set; } = [];
        public List<string>? UrlMidiasEntreguesEstagiario { get; set; } = [];
    }
}
