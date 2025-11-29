using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using CSharpFunctionalExtensions;
using Microsoft.Extensions.Logging;

namespace ReviewAnalyzer.Application.Services;

public interface IProcessReview
{
    Task<Result<byte[]>> AnalyzeCsvAsync(byte[] csvBytes, string fileName, CancellationToken cancellationToken);
}

public class ProcessReview : IProcessReview
{
    private readonly HttpClient _http;
    private readonly ILogger<ProcessReview> _logger;

    public ProcessReview(HttpClient http, ILogger<ProcessReview> logger)
    {
        _http = http;
        _logger = logger;
        _http.BaseAddress = new Uri("https://model.ru.tuna.am/");
    }

    public async Task<Result<byte[]>> AnalyzeCsvAsync(byte[] csvBytes, string fileName, CancellationToken cancellationToken)
    {
        try
        {
            using var form = new MultipartFormDataContent();
            
            using var fileContent = new ByteArrayContent(csvBytes);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("text/csv");
            
            form.Add(fileContent, "file", fileName);

            var response = await _http.PostAsync("labels/file", form, cancellationToken);
            response.EnsureSuccessStatusCode();

            var resultBytes = await response.Content.ReadAsByteArrayAsync(cancellationToken);

            if (resultBytes.Length == 0)
            {
                _logger.LogCritical("File is empty");
                return Result.Failure<byte[]>("File is empty");
            }

            return Result.Success(resultBytes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            return Result.Failure<byte[]>(ex.Message);
        }
    }

}