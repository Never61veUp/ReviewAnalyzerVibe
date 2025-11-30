using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Mvc;
using ReviewAnalyzer.Application.Services;
using ReviewAnalyzer.Core.Model;

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
    
    [HttpGet("review-percent-positive")]
    public async Task<IActionResult> GetPercentPositiveReview(CancellationToken cancellationToken = default) => 
        FromResult(await _service.GetPercentPositiveReview(cancellationToken));
    
    [HttpGet("review-label-count")]
    public async Task<IActionResult> GetPositiveReviewCount(CancellationToken cancellationToken, Label label = Label.Положительный) => 
        FromResult(await _service.GetLabelReviewCount(cancellationToken, label));
    
    [HttpGet("review-percent-positive-in-group{groupId:guid}")]
    public async Task<IActionResult> GetPercentPositiveReview(Guid groupId, CancellationToken cancellationToken = default, int neutralCoeff = 0) => 
        FromResult(await _service.GetPercentPositiveReviewInGroup(groupId, cancellationToken,  neutralCoeff));
    
    [HttpGet("review-label-count-in-group{groupId:guid}")]
    public async Task<IActionResult> GetPositiveReviewCountInGroup(Guid groupId, Label label = Label.Положительный, CancellationToken cancellationToken = default) => 
        FromResult(await _service.GetLabelReviewCountInGroup(groupId, cancellationToken, label));
    
    [HttpGet("review-src-positive-percent{groupId:guid}")]
    public async Task<IActionResult> GetPositiveReviewCountInGroup(Guid groupId, CancellationToken cancellationToken = default) => 
        FromResult(await _service.GetPositiveSrcPercentList(groupId, cancellationToken));

    [HttpGet("review-one")]
    public async Task<IActionResult> ParseOneReview(string review, CancellationToken cancellationToken = default)
    {
        var result = await _service.ParseOneReview(review, cancellationToken);
        return FromResult(result);
    }
}