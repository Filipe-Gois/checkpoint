using System;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using web_api_checkpoint.Interfaces;

namespace GerarPresencaEstagiario
{
    public class GerarPresencaEstagiario
    {
        private readonly ILogger _logger;
        private readonly IPresencaRepository _presencaRepository;

        public GerarPresencaEstagiario(IPresencaRepository presencaRepository, ILoggerFactory loggerFactory)
        {
            _presencaRepository = presencaRepository;
            _logger = loggerFactory.CreateLogger<GerarPresencaEstagiario>();
        }

        [Function("GerarPresencaEstagiario")]
        public void Run([TimerTrigger("0 0 3 * * *")] TimerInfo myTimer)
        {
            _logger.LogInformation($"Fun��o GerarPresencaEstagiario executada �s {DateTime.Now}");

            try
            {
                _presencaRepository.GerarPresenca();
                _logger.LogInformation("Fun��o de gera��o de presen�a executada com sucesso.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao executar a fun��o GerarPresencaEstagiario: {ex.Message}");
            }
        }
    }
}
