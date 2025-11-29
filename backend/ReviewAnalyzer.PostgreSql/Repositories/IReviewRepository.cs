using CSharpFunctionalExtensions;
using ReviewAnalyzer.PostgreSql.Model;

namespace ReviewAnalyzer.PostgreSql.Repositories;

public interface IReviewRepository
{
    Task<Result<IEnumerable<ReviewEntity>>> GetReviewsByGroupId(Guid groupId, int count, CancellationToken cancellationToken);
    Task<Result> AddReviewAsync(ReviewEntity reviewEntity, CancellationToken cancellationToken);
    Task<Result> AddReviewsAsync(IEnumerable<ReviewEntity> reviewEntity, CancellationToken cancellationToken);
    Task<Result<IEnumerable<ReviewEntity>>> GetReviewsByTitle(string title, int count, CancellationToken cancellationToken);
}