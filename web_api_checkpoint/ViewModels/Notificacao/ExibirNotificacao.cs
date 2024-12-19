namespace web_api_checkpoint.ViewModels.Notificacao
{
    public class ExibirNotificacao
    {
        public Guid IdNotificacao { get; set; }
        public string? Titulo { get; set; }
        public string? Descricao { get; set; }
        public string? TipoNotificacao { get; set; }
        public DateTime? DataEHora { get; set; }
        public List<Guid?> IdDestinatarios { get; set; } = [];
    }
}
