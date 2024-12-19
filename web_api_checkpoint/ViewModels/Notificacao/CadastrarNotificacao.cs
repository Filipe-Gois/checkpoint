using MongoDB.Bson.Serialization.Attributes;

namespace web_api_checkpoint.ViewModels.Notificacao
{
    public class CadastrarNotificacao
    {
        public string? Titulo { get; set; }
        public string? Descricao { get; set; }
        public List<Guid?> IdDestinatarios { get; set; } = [];
    }
}
