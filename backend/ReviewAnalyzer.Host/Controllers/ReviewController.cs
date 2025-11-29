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

    [HttpGet("{groupId}")]
    public async Task<IActionResult> Get(Guid groupId, int count, CancellationToken cancellationToken)
    {
        var result = await _service.GetByGroupId(groupId, count, cancellationToken);
        return FromResult(result);
    }
    
    [HttpGet("{title}")]
    public async Task<IActionResult> Get(string titile, int count, CancellationToken cancellationToken)
    {
        var result = await _service.FilterTitle(titile, count, cancellationToken);
        return FromResult(result);
    }
}