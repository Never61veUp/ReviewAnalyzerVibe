using CSharpFunctionalExtensions;
using ReviewAnalyzer.Core.Model;
using ReviewAnalyzer.PostgreSql.Repositories;

namespace ReviewAnalyzer.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _repository;

    public ReviewService(IReviewRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IEnumerable<Review>>> GetByGroupId(Guid groupId, int count, CancellationToken cancellationToken)
    {
        var reviewsResult = await _repository.GetReviewsByGroupId(groupId, count, cancellationToken);
        if(reviewsResult.IsFailure)
            return Result.Failure<IEnumerable<Review>>(reviewsResult.Error);
        
        var reviews = reviewsResult.Value
            .Select(r => Review.Create(
                r.Text,
                r.Labels,
                r.Src,
                r.Confidence,
                r.Id
            ))
            .Where(result => result.IsSuccess)
            .Select(result => result.Value)
            .ToList();
        
        return Result.Success<IEnumerable<Review>>(reviews);
    }

    public async Task<Result<IEnumerable<Review>>> FilterTitle(string title, int count, CancellationToken cancellationToken)
    {
        var reviewsResult = await _repository.GetReviewsByTitle(title, count, cancellationToken);
        if(reviewsResult.IsFailure)
            return Result.Failure<IEnumerable<Review>>(reviewsResult.Error);
        
        var reviews = reviewsResult.Value
            .Select(r => Review.Create(
                r.Text,
                r.Labels,
                r.Src,
                r.Confidence,
                r.Id
            ))
            .Where(result => result.IsSuccess)
            .Select(result => result.Value)
            .ToList();
        
        return Result.Success<IEnumerable<Review>>(reviews);
    }
}