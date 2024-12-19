using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_api_checkpoint.Domains
{
    public enum RoleEnum
    {
        Administrador,
        Gestor,
        Estagiario
    }

    [Table("Usuario")]
    [Index(nameof(EmailCorporativo), nameof(EmailPessoal), IsUnique = true)] //faz com que o email seja unico nas duas colunas :)
    public class Usuario
    {
        [Key]
        public Guid IdUsuario { get; set; } = Guid.NewGuid();

        [Column(TypeName = "VARCHAR(50)")]
        [Required(ErrorMessage = "O Nome é obrigatório!")]
        public string? Nome { get; set; }

        [Column(TypeName = "VARCHAR(50)")]
        [Required(ErrorMessage = "O SobreNome é obrigatório!")]
        public string? SobreNome { get; set; }


        [Column(TypeName = "VARCHAR(100)")]
        [Required(ErrorMessage = "O Email Pessoal é obrigatório!")]
        public string? EmailPessoal { get; set; }


        [Column(TypeName = "VARCHAR(100)")]
        [Required(ErrorMessage = "O Email Corporativo é obrigatório!")]
        public string? EmailCorporativo { get; set; }

        [Column(TypeName = "TEXT")]
        [Required(ErrorMessage = "A senha é obrigatória!")]
        [StringLength(60, MinimumLength = 5, ErrorMessage = "A senha deve conter entre 5 e 30 caracteres.")]
        public string? Senha { get; set; }

        [Column(TypeName = "BIT")]
        public bool? IsActive { get; set; } = true;


        [Column(TypeName = "NCHAR(6)")]
        public string? CodigoRecSenha { get; set; }

        [Column(TypeName = "INT")]
        public int Role { get; set; }

    }
}
