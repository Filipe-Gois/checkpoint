

namespace web_api_checkpoint.ViewModels.Usuario
{
    public class CadastrarUsuario
    {
        public string? Nome { get; set; }
        public string? SobreNome { get; set; }
        public string? EmailPessoal { get; set; }
        public string? EmailCorporativo { get; set; }
        public string? Senha { get; set; }
        public int Role { get; set; }
        public Guid? IdExpediente { get; set; }

    }
}
