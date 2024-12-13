using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace web_api_checkpoint.Domains
{

    enum NotificacaoEnum
    {
        LancamentoDeTarefa,
        EntregaDeTarefa,
        CorrecaoDeTarefa,
        EnvioDeJustificativaDeFalta,
        ValidacaoDeJustificativaDeFalta,
    }
    public class Notificacao
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid IdNotificacao { get; set; } = Guid.NewGuid();

        [BsonElement("Titulo")]
        public string? Titulo { get; set; }

        [BsonElement("Descricao")]
        public string? Descricao { get; set; }

        [BsonElement("DataEHora")]
        public DateTime DataEHora { get; set; }
        [BsonElement("IdDestinatarios")]
        [BsonRepresentation(BsonType.String)]
        public List<Guid?> IdDestinatarios { get; set; } = [];

        [BsonElement("TipoNotificacao")]
        public int TipoNotificacao { get; set; }


        public Notificacao()
        {
            DateTime utcNow = DateTime.UtcNow;

            // Converter para o horário de Brasília (GMT-3)
            TimeZoneInfo brasiliaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
            DateTime brasiliaNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, brasiliaTimeZone);

            DataEHora = brasiliaNow;

        }
    }
}
