namespace web_api_checkpoint.ViewModels.Ranking
{
    public class ExibirRanking
    {
        public Guid IdEstagiario { get; set; }
        public double Pontuacao { get; set; }
        public double Presenca { get; set; }
        public string? Nome { get; set; }
        public string? SobreNome { get; set; }

    }
}
