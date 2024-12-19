namespace web_api_checkpoint.ViewModels.Presenca
{
    public class ExibirResumoPresenca
    {
        public int DiasLetivos { get; set; }
        public int TotalPresencas { get; set; }
        public int TotalFaltas { get; set; }
        public int TotalAtrasos { get; set; }
        public int TotalSaidasAntesDoFimDoExpediente { get; set; }
    }
}
