using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace web_api_checkpoint.Domains
{

    [Table("CalendarioLetivo")]
    [Index(nameof(Data), IsUnique = true)]
    public class CalendarioLetivo
    {

        [Key]
        public Guid IdCalendarioLetivo { get; set; } = Guid.NewGuid();

        [Column(TypeName = "DATE")]
        public DateTime Data { get; set; } = DateTime.Now;

        [Column(TypeName = "BIT")]
        public bool IsDiaLetivo { get; set; } = true;

        public CalendarioLetivo()
        {
            DateTime dataAtual = DateTime.Now;
            if (dataAtual.DayOfWeek == DayOfWeek.Saturday || dataAtual.DayOfWeek == DayOfWeek.Sunday)
            {
                IsDiaLetivo = false;
            }

        }
    }
}
