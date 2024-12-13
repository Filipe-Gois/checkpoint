
namespace web_api_checkpoint.ViewModels.Usuario
{
    public class ExibirUsuario
    {
        public Guid? IdUsuario { get; set; }
        public string? Nome { get; set; }
        public string? SobreNome { get; set; }
        public string? EmailPessoal { get; set; }
        public string? EmailCorporativo { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
    }
}