namespace web_api_checkpoint.ViewModels.Usuario.Estagiario
{
    public class ExibirDadosPorMes
    {
        public DateTime MesAno { get; set; }
        public int TotalPresencas { get; set; }
        public int TotalFaltas { get; set; }
        public int TotalAtrasos { get; set; }
        public double PontuacaoTotal { get; set; }
    }
}
