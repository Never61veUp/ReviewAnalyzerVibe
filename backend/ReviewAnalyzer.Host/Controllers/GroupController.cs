using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ReviewAnalyzer.Application.Services;
using ReviewAnalyzer.Host.Contracts;

namespace ReviewAnalyzer.Host.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroupController : BaseController
{
    private readonly IGroupReviewService _groupReviewService;

    public GroupController(IGroupReviewService groupReviewService)
    {
        _groupReviewService = groupReviewService;
    }
    
    [HttpPost("upload")]
    public async Task<IActionResult> UploadCsv(IFormFile file, CancellationToken cancellationToken)
    {
        if (file.Length == 0)
            return BadRequest("File is empty");

        if (!file.FileName.EndsWith(".csv"))
            return BadRequest("File is not a csv file");
        
        byte[] csvBytes;
        using (var ms = new MemoryStream())
        {
            await file.CopyToAsync(ms, cancellationToken);
            csvBytes = ms.ToArray();
        }
        
        var result = await _groupReviewService.AddGroupReview(csvBytes, file.FileName, cancellationToken);
        
        return FromResult(result);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GroupResponse>>> GetGroupsWithoutReviews(CancellationToken cancellationToken)
    {
        var result = await _groupReviewService.GetAllGroups(cancellationToken);
        if (result.IsFailure)
            return BadRequest(result.Error);

        var groupResponses = result.Value.Select(GroupResponse.FromDomain).ToList();
        return groupResponses;
    }
}