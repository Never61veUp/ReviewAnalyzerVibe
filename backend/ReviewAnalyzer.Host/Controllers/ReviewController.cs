using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Mvc;
using ReviewAnalyzer.Application.Services;

namespace ReviewAnalyzer.Host.Controllers;

[ApiController]
[Route("[controller]")]
public class ReviewController : BaseController
{
    private readonly IReviewService _service;

    public ReviewController(IReviewService service)
    {
        _service = service;
    }

    [HttpGet("{groupId:guid}")]
    public async Task<IActionResult> Get(Guid groupId, int count = -1, CancellationToken cancellationToken = default)
    {
        var result = await _service.GetByGroupId(groupId, cancellationToken, count);
        return FromResult(result);
    }
    
    [HttpGet("by-title/{title}")]
    public async Task<IActionResult> Get(string title, int count = -1, CancellationToken cancellationToken = default)
    {
        var result = await _service.FilterTitle(title, cancellationToken, count);
        return FromResult(result);
    }
    
    [HttpGet("export-stream")]
    public async Task ExportStream(Guid groupId, CancellationToken cancellationToken)
    {
        var reviewsResult = await _service.GetByGroupId(groupId, cancellationToken);

        Response.ContentType = "text/csv";
        Response.Headers.Append("Content-Disposition", "attachment; filename=reviews.csv");

        await using var writer = new StreamWriter(Response.Body);

        await writer.WriteLineAsync("Id,Text,Label,Src,Confidence");

        foreach (var r in reviewsResult.Value)
        {
            var row = $"{r.Id},\"{r.Text.Replace("\"","\"\"")}\",{r.Label},{r.Src},{r.Confidence}";
            await writer.WriteLineAsync(row);
            await writer.FlushAsync(cancellationToken);
        }
    }

    [HttpGet("review-count")]
    public async Task<IActionResult> GetReviewCount(CancellationToken cancellationToken = default) => 
        FromResult(await _service.GetReviewCount(cancellationToken));
    
        
}