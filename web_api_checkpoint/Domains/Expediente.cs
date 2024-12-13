using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_api_checkpoint.Domains
{
    [Table("Expediente")]
    public class Expediente
    {
        [Key]
        public Guid IdExpediente { get; set; } = Guid.NewGuid();

        [Column(TypeName = "VARCHAR(100)")]
        public string? Descricao { get; set; }

        [Column(TypeName = "TIME")]
        public TimeOnly InicioExpediente { get; set; }

        [Column(TypeName = "TIME")]
        public TimeOnly FimExpediente { get; set; }

    }
}
