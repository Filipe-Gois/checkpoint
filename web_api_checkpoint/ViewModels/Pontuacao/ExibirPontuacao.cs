namespace web_api_checkpoint.ViewModels.Pontuacao
{
    public class ExibirPontuacao
    {
        public Guid? IdSquad { get; set; }
        public Guid IdEstagiario { get; set; }
        public int Mes { get; set; }
        public int Ano { get; set; }
        public string? Nome { get; set; }
        public string? SobreNome { get; set; }
        public double PontuacaoTotal { get; set; }
    }
}
