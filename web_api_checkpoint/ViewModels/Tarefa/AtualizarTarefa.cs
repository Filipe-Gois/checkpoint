using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace web_api_checkpoint.ViewModels.Tarefa
{
    public class AtualizarTarefa
    {
        public string? Titulo { get; set; }
        public string? Descricao { get; set; }
        public DateTime Prazo { get; set; }
        public Guid IdEstagiario { get; set; }
        public int Dificuldade { get; set; }

        [NotMapped]
        [JsonIgnore]
        public List<IFormFile> ArquivosDeImagens { get; set; } = [];
    }
}
