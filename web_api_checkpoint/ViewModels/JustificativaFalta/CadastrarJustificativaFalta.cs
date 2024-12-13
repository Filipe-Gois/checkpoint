namespace web_api_checkpoint.ViewModels.Justificativa
{
    public class CadastrarJustificativaFalta
    {
        public IFormFile? Arquivo { get; set; }
        public Guid IdEstagiario { get; set; }
        public DateTime Data { get; set; }
    }
}
