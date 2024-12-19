using Microsoft.EntityFrameworkCore;
using web_api_checkpoint.Domains;

namespace web_api_checkpoint.Contexts
{
    public class CheckpointContext : DbContext
    {

        // Construtor que recebe DbContextOptions e o passa para o DbContext base
        public CheckpointContext(DbContextOptions<CheckpointContext> options) : base(options)
        {
        }

        public DbSet<Estagiario> Estagiario { get; set; }
        public DbSet<Expediente> Expediente { get; set; }
        public DbSet<JustificativaFalta> JustificativaFalta { get; set; }
        public DbSet<Midia> Midia { get; set; }
        public DbSet<Presenca> Presenca { get; set; }
        public DbSet<Squad> Squad { get; set; }
        public DbSet<SquadGestor> SquadGestor { get; set; }
        public DbSet<Tarefa> Tarefa { get; set; }
        public DbSet<TarefaEstagiarioMidia> TarefaEstagiarioMidia { get; set; }
        public DbSet<Usuario> Usuario { get; set; }
        public DbSet<TarefaMidia> TarefaMidia { get; set; }
        public DbSet<CalendarioLetivo> CalendarioLetivo { get; set; }
    }
}
