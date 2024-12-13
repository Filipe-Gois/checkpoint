namespace web_api_checkpoint.ViewModels.Usuario.Estagiario
{
    public enum FiltroRelatorioEstagiario
    {
        UltimoMes,
        UltimosTresMeses,
        UltimosSeisMeses,
    }
    public class ExibirRelatorioEstagiario
    {
        public string? Matrícula { get; set; }
        public string? NomeCompleto { get; set; }
        public string? EmailPessoal { get; set; }
        public string? EmailCorporativo { get; set; }
        public string? SquadNome { get; set; }
        public TimeOnly? InicioExpediente { get; set; }
        public TimeOnly? FimExpediente { get; set; }
        public int DiasLetivos { get; set; }
        public int TotalPresencas { get; set; }
        public int TotalFaltas { get; set; }
        public int TotalAtrasos { get; set; }
        public double TotalPontuacao { get; set; }
    }
}
