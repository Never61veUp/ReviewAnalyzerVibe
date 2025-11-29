using CSharpFunctionalExtensions;
using ReviewAnalyzer.Core.Model;

namespace ReviewAnalyzer.Application.Services;

public interface IReviewService
{
    Task<Result<IEnumerable<Review>>> GetByGroupId(Guid groupId, int count, CancellationToken cancellationToken);
    Task<Result<IEnumerable<Review>>> FilterTitle(string title, int count, CancellationToken cancellationToken);
}