namespace web_api_checkpoint.ViewModels.Tarefa
{
    public class CadastrarTarefa
    {
        public string? Titulo { get; set; }
        public string? Descricao { get; set; }
        public DateTime Prazo { get; set; }
        public int Dificuldade { get; set; }
        public Guid? IdEstagiarioAtribuido { get; set; }
        public List<IFormFile>? ArquivosDeImagens { get; set; } = [];
    }
}
