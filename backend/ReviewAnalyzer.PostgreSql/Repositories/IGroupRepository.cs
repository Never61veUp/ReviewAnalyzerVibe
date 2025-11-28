using CSharpFunctionalExtensions;
using ReviewAnalyzer.PostgreSql.Model;

namespace ReviewAnalyzer.PostgreSql.Repositories;

public interface IGroupRepository
{
    Task<Result<IEnumerable<ReviewGroupEntity>>> GetAllGroupsWithoutReviews();
    Task<Result> AddGroupAsync(ReviewGroupEntity groupEntity, CancellationToken cancellationToken);
}