using Azure.Storage.Blobs;
using web_api_checkpoint.Domains;

namespace WebAPI.Utils.BlobStorage
{
    public static class AzureBlobStorageHelper
    {
        private static readonly string StringConnectionBlobStorage = Environment.GetEnvironmentVariable("StringConnectionBlobStorage")!;

        private static readonly string ContainerName = Environment.GetEnvironmentVariable("ContainerNameBlobStorage")!;
        public static async Task<Midia> UploadImageBlobAsync(IFormFile file)
        {
            try
            {
                Midia midiaUpada = new();
                //verifica se existe um arquivo
                if (file != null)
                {
                    //gera um nome unico + extensao do arquivo
                    var blobName = Guid.NewGuid().ToString().Replace("-", "") + Path.GetExtension(file.FileName);

                    //cria uma instancia do client blob service e passa a string de conexao 
                    var blobServiceClient = new BlobServiceClient(StringConnectionBlobStorage);

                    //obtem um container client usando o nome do container do blob
                    var blobContainerClient = blobServiceClient.GetBlobContainerClient(ContainerName);

                    //obtem um blob client usando o blob name
                    var blobClient = blobContainerClient.GetBlobClient(blobName);

                    //abre o fluxo de entrada do arquivo(foto)
                    using (var stream = file.OpenReadStream())
                    {
                        //carrega o arquivo para o blob storage de forma assincrona 
                        await blobClient.UploadAsync(stream, true);
                    }
                    //retorna a uri do blob como uma string 
                    midiaUpada.Url = blobClient.Uri.ToString();

                    midiaUpada.BlobStorageName = blobName;
                }
                return midiaUpada;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public static async Task DeleteBlobAsync(string blobName)
        {
            try
            {
                // Cria uma instância do cliente BlobService usando a string de conexão
                var blobServiceClient = new BlobServiceClient(StringConnectionBlobStorage);

                // Obtém um BlobContainerClient para o container onde o blob está localizado
                var blobContainerClient = blobServiceClient.GetBlobContainerClient(ContainerName);

                // Obtém um BlobClient para o blob que deseja deletar
                var blobClient = blobContainerClient.GetBlobClient(blobName);

                // Deleta o blob de forma assíncrona
                await blobClient.DeleteIfExistsAsync();
            }
            catch (Exception e)
            {

                throw;
            }
        }
    }
}