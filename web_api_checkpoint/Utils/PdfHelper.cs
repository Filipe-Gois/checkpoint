using PdfSharp.Drawing;
using PdfSharp.Pdf;
using System.Globalization;
using web_api_checkpoint.ViewModels.Usuario.Estagiario;

namespace web_api_checkpoint.Utils
{
    public static class PdfHelper
    {
        public static byte[] GerarRelatorioEstagiarioPdf(ExibirRelatorioEstagiario estagiario, List<ExibirDadosPorMes> dadosPorMes)
        {
            DateTime utcNow = DateTime.UtcNow;

            // Converter para o horário de Brasília (GMT-3)
            TimeZoneInfo brasiliaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
            DateTime brasiliaNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, brasiliaTimeZone);

            string dataRelatorio = brasiliaNow.ToString("dd 'de' MMMM 'de' yyyy 'às' HH:mm", new CultureInfo("pt-BR"));

            dadosPorMes = dadosPorMes.OrderBy(m => m.MesAno).ToList();

            var logoPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "logo_checkpoint.png");

            var logoImage = XImage.FromFile(logoPath);

            double logoWidth = 200; // Largura desejada para a logo
            double logoHeight = logoImage.PixelHeight * (logoWidth / logoImage.PixelWidth); // Mantém a proporção

            double logoX = 40; // Margem esquerda
            double logoY = 40; // Margem superior

            XColor azulPersonalizado = XColor.FromArgb(55, 116, 169);



            using (var memoryStream = new MemoryStream())
            {
                using (var document = new PdfDocument())
                {
                    // Configurações de página e fonte
                    double marginTop = logoY * 2.5;
                    double marginLeft = 40;
                    double lineHeight = 20;
                    double pageHeight = 842; // Altura padrão da página A4 em pontos
                    double contentHeight = pageHeight - marginTop * 2;
                    XFont fontTitle = new XFont("Arial", 20, XFontStyleEx.Bold);
                    XFont fontBody = new XFont("Arial", 12, XFontStyleEx.Regular);
                    XFont fontItalic = new XFont("Arial", 12, XFontStyleEx.Italic);




                    void AddPage(out XGraphics graphics, out PdfPage page)
                    {
                        page = document.AddPage();
                        graphics = XGraphics.FromPdfPage(page);
                    }

                    AddPage(out var graphics, out var page);
                    double currentY = marginTop;

                    graphics.DrawImage(logoImage, logoX, logoY, logoWidth, logoHeight);

                    // Cabeçalho do relatório
                    graphics.DrawString($"Relatório de Estagiário: {estagiario.NomeCompleto}", fontTitle, XBrushes.Black,
                        new XRect(0, currentY, page.Width, page.Height), XStringFormats.TopCenter);

                    currentY += lineHeight * 2;
                    graphics.DrawString($"Matrícula: {estagiario.Matrícula}", fontBody, XBrushes.Black,
                        new XRect(marginLeft, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);

                    currentY += lineHeight;
                    // Parte inicial do texto (cor normal)
                    graphics.DrawString("Email Pessoal: ", fontBody, XBrushes.Black, // ou qualquer outra cor
                        new XRect(marginLeft, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);

                    // Calcula o tamanho do texto inicial para ajustar a posição do texto em itálico
                    var textWidth = graphics.MeasureString("Email Pessoal: ", fontBody).Width;

                    // Texto do email (em itálico e cor azul)
                    graphics.DrawString(estagiario.EmailPessoal, fontItalic, new XSolidBrush(azulPersonalizado),
                        new XRect(marginLeft + textWidth, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);


                    currentY += lineHeight;
                    // Parte inicial do texto (cor normal)
                    graphics.DrawString("Email Corporativo: ", fontBody, XBrushes.Black, // ou qualquer outra cor
                        new XRect(marginLeft, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);

                    // Texto do email (em itálico e cor azul)
                    graphics.DrawString(estagiario.EmailCorporativo, fontItalic, new XSolidBrush(azulPersonalizado),
                        new XRect(marginLeft * 3.5, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);

                    currentY += lineHeight;
                    graphics.DrawString($"Squad: {estagiario.SquadNome}", fontBody, XBrushes.Black,
                        new XRect(marginLeft, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);

                    currentY += lineHeight;
                    graphics.DrawString($"Início Do Expediente: {estagiario.InicioExpediente}", fontBody, XBrushes.Black,
                      new XRect(marginLeft, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);


                    currentY += lineHeight;
                    graphics.DrawString($"Término Do Expediente: {estagiario.FimExpediente}", fontBody, XBrushes.Black,
                        new XRect(marginLeft, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);

                    currentY += lineHeight * 2;

                    // Adicionando dados por mês
                    foreach (var mesData in dadosPorMes)
                    {
                        // Verificar se há espaço suficiente na página atual
                        if (currentY + lineHeight * 5 > contentHeight)
                        {
                            AddPage(out graphics, out page);
                            currentY = 40; // Reinicia a posição vertical
                        }

                        string tituloMes = mesData.MesAno.ToString("MMMM yyyy", new CultureInfo("pt-BR"));

                        tituloMes = char.ToUpper(tituloMes[0]) + tituloMes.Substring(1).ToLower();

                        graphics.DrawString(tituloMes, fontTitle, XBrushes.Black,
                            new XRect(marginLeft, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);

                        currentY += lineHeight * 1.5;
                        graphics.DrawString($"Pontuação: {mesData.PontuacaoTotal}", fontBody, XBrushes.Black,
                            new XRect(marginLeft, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);

                        currentY += lineHeight;
                        graphics.DrawString($"Presenças: {mesData.TotalPresencas}", fontBody, XBrushes.Black,
                            new XRect(marginLeft, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);

                        currentY += lineHeight;
                        graphics.DrawString($"Faltas: {mesData.TotalFaltas}", fontBody, XBrushes.Black,
                            new XRect(marginLeft, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);

                        currentY += lineHeight;
                        graphics.DrawString($"Atrasos: {mesData.TotalAtrasos}", fontBody, XBrushes.Black,
                            new XRect(marginLeft, currentY, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);

                        currentY += lineHeight * 2;
                    }

                    var fontFooter = new XFont("Arial", 10, XFontStyleEx.Regular);

                    // Alinhar no canto inferior direito
                    graphics.DrawString($"Relatório gerado em: {dataRelatorio}", fontFooter, XBrushes.Black,
                        new XRect(marginLeft, page.Height - marginTop / 2, page.Width - marginLeft * 2, page.Height), XStringFormats.TopLeft);

                    document.Save(memoryStream);
                }

                return memoryStream.ToArray();
            }
        }


    }
}
