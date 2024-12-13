using web_api_checkpoint.ViewModels.CalendarioLetivo;

namespace web_api_checkpoint.ViewModels.Presenca
{
    public class ExibirPresenca
    {
        public Guid IdPresenca { get; set; }
        public TimeOnly? HorarioEntrada { get; set; }
        public TimeOnly? HorarioSaida { get; set; }
        public DateTime Data { get; set; }
    }
}
