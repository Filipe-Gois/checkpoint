using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using web_api_checkpoint.Domains;

namespace web_api_checkpoint.ViewModels.JustificativaFalta
{
    public class ExibirJustificativaFalta
    {
        public Guid IdJustificativaFalta { get; set; }
        public string? StatusValidacao { get; set; }
        public string? MotivoRejeicao { get; set; }
        public DateTime Data { get; set; }
        public string? UrlArquivo { get; set; }
        public string? Matrícula { get; set; }
        public string? Nome { get; set; }
        public string? SobreNome { get; set; }
    }
}
