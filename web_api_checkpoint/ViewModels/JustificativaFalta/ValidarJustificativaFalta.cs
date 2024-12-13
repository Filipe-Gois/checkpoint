using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using web_api_checkpoint.Domains;

namespace web_api_checkpoint.ViewModels.Justificativa
{
    public class ValidarJustificativaFalta
    {
        [Required]
        public int StatusValidacao { get; set; }
        public string? MotivoRejeicao { get; set; }
        public Guid IdJustificativaFalta { get; set; }

    }
}
