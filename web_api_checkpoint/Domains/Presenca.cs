using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_api_checkpoint.Domains
{
    [Table("Presenca")]
    public class Presenca
    {
        [Key]
        public Guid IdPresenca { get; set; } = Guid.NewGuid();

        [Column(TypeName = "TIME")]
        public TimeOnly? HorarioEntrada { get; set; }

        [Column(TypeName = "TIME")]
        public TimeOnly? HorarioSaida { get; set; }

        public Guid? IdEstagiario { get; set; }

        [ForeignKey("IdEstagiario")]
        public Estagiario? Estagiario { get; set; }
        public Guid? IdCalendarioLetivo { get; set; }

        [ForeignKey("IdCalendarioLetivo")]
        public CalendarioLetivo? CalendarioLetivo { get; set; }

    }
}
