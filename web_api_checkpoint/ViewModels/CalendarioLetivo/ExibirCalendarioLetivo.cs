using System.ComponentModel.DataAnnotations.Schema;

namespace web_api_checkpoint.ViewModels.CalendarioLetivo
{
    public class ExibirCalendarioLetivo
    {
        public Guid IdCalendarioLetivo { get; set; }
        public DateTime Data { get; set; }
        public bool IsDiaLetivo { get; set; }
    }
}
