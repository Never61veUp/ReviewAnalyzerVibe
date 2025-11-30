using CSharpFunctionalExtensions;
using ReviewAnalyzer.Core.Model;

namespace ReviewAnalyzer.Application.Services;

public interface IReviewService
{
    Task<Result<IEnumerable<Review>>> GetByGroupId(Guid groupId, CancellationToken cancellationToken = default, int count = -1);
    Task<Result<IEnumerable<Review>>> FilterTitle(string title, CancellationToken cancellationToken = default, int count = -1);
    Task<Result<int>> GetReviewCount(CancellationToken cancellationToken = default);
    Task<Result<double>> GetPercentPositiveReview(CancellationToken cancellationToken = default);
    Task<Result<int>> GetLabelReviewCount(CancellationToken cancellationToken = default, Label label = default);
    Task<Result<double>> GetPercentPositiveReviewInGroup(Guid groupId, CancellationToken cancellationToken = default, int neutralCoeff = 0);
    Task<Result<int>> GetLabelReviewCountInGroup(Guid groupId, CancellationToken 
        cancellationToken = default, Label label = Label.Положительный);

    Task<Result<Dictionary<string, double>>> GetPositiveSrcPercentList(Guid groupId,
        CancellationToken cancellationToken = default);

    Task<Result<Review>> ParseOneReview(byte[] review, CancellationToken cancellationToken = default);
}