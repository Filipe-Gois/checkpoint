using System.ComponentModel.DataAnnotations;

namespace web_api_checkpoint.ViewModels.Expediente
{
    public class CadastrarExpediente
    {
        public string? Descricao { get; set; }

        [RegularExpression(@"^([01]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$", ErrorMessage = "O formato do tempo deve ser hh:mm:ss")]
        public string? InicioExpediente { get; set; }

        [RegularExpression(@"^([01]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$", ErrorMessage = "O formato do tempo deve ser hh:mm:ss")]
        public string? FimExpediente { get; set; }
    }
}
