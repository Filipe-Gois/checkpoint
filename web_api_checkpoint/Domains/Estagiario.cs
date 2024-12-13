using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace web_api_checkpoint.Domains
{
    [Index(nameof(Matrícula), IsUnique = true)]
    [Table("Estagiario")]
    public class Estagiario
    {

        [Key]
        public Guid IdEstagiario { get; set; } = Guid.NewGuid();

        [Column(TypeName = "VARCHAR(100)")]
        public string? Matrícula { get; set; } = new Random().Next(100000, 1000000).ToString();

        [Column(TypeName = "BIT")]
        public bool IsBolsista { get; set; } = false;

        public Guid? IdUsuario { get; set; }

        [ForeignKey("IdUsuario")]
        public Usuario? Usuario { get; set; }


        public Guid? IdSquad { get; set; }

        [ForeignKey("IdSquad")]
        public Squad? Squad { get; set; }

        [Required(ErrorMessage = "O Expediente é obrigatório!")]
        public Guid? IdExpediente { get; set; }

        [ForeignKey("IdExpediente")]
        public Expediente? Expediente { get; set; }
    }
}
