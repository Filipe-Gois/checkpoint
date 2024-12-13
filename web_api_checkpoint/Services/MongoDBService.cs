using MongoDB.Driver;

namespace web_api_checkpoint.Services
{
    public class MongoDBService()
    {
        private readonly IConfiguration _configuration;

        private readonly IMongoDatabase _database;

        public MongoDBService(IConfiguration configuration) : this()
        {
            //atribui a config recebida em _configuration
            _configuration = configuration;


            //acessa a string de conexão
            //string connectionString = Environment.GetEnvironmentVariable("MongoDBStringConnection")!;
            string connectionString = "mongodb+srv://filipe:S848Zje4CI5rqDjv@checkpointnotificacoesd.bsuic.mongodb.net/NotificacoesCheckPointDataBase?retryWrites=true&w=majority&appName=checkpointnotificacoesdb";

            //transforma a string obtida em mongourl
            MongoUrl mongoUrl = MongoUrl.Create(connectionString);

            //cria um client
            MongoClient mongoClient = new(mongoUrl);

            //obtém a referencia ao MongoDB
            _database = mongoClient.GetDatabase(mongoUrl.DatabaseName);

        }

        /// <summary>
        /// Propriedade para acessar o BD => retorna os dados em _database
        /// </summary>
        public IMongoDatabase GetDatabase => _database;

    }
}
