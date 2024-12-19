using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_api_checkpoint.Domains
{
    public enum DificuldadeEnum
    {
        Facil = 10,
        Medio = 25,
        Dificil = 50
    }
    public enum StatusCorrecaoEnum
    {
        EmAnalise,
        Pendente,
        Errada,
        Certa
    }

    [Table("Tarefa")]
    public class Tarefa
    {
        [Key]
        public Guid IdTarefa { get; set; } = Guid.NewGuid();

        [Column(TypeName = "VARCHAR(100)")]
        public string? Titulo { get; set; }

        [Column(TypeName = "TEXT")]
        public string? Descricao { get; set; }

        [Column(TypeName = "TEXT")]
        public string? DescricaoCorrecao { get; set; }

        [Column(TypeName = "DATE")]
        public DateTime Prazo { get; set; }

        [Column(TypeName = "INT")]
        public int Dificuldade { get; set; }

        [Column(TypeName = "INT")]
        public int StatusCorrecao { get; set; } = (int)StatusCorrecaoEnum.Pendente;
        public Guid? IdEstagiario { get; set; }

        [ForeignKey("IdEstagiario")]
        public Estagiario? Estagiario { get; set; }
    }
}
