using CSharpFunctionalExtensions;
using ReviewAnalyzer.Core.Model;
using ReviewAnalyzer.PostgreSql.Model;
using ReviewAnalyzer.PostgreSql.Repositories;

namespace ReviewAnalyzer.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _repository;
    private readonly IProcessReview _processReview;

    public ReviewService(IReviewRepository repository, IProcessReview processReview)
    {
        _repository = repository;
        _processReview = processReview;
    }

    public async Task<Result<IEnumerable<Review>>> GetByGroupId(Guid groupId, CancellationToken cancellationToken, int count = 0)
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

    public async Task<Result<IEnumerable<Review>>> FilterTitle(string title, CancellationToken cancellationToken, int count = 0)
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
    
    public async Task<Result<int>> GetReviewCount(CancellationToken cancellationToken) => 
        await _repository.GetReviewCount(cancellationToken);
    
    public async Task<Result<double>> GetPercentPositiveReview(CancellationToken cancellationToken) => 
        await _repository.GetPercentPositiveReview(cancellationToken);
    public async Task<Result<int>> GetLabelReviewCount(CancellationToken cancellationToken, Label label = Label.Положительный) => 
        await _repository.GetLabelReviewCount(cancellationToken, label);
    
    public async Task<Result<double>> GetPercentPositiveReviewInGroup(Guid groupId, CancellationToken cancellationToken, int neutralCoeff = 0) => 
        await _repository.GetPercentPositiveReviewInGroup(groupId, cancellationToken, neutralCoeff);
    public async Task<Result<int>> GetLabelReviewCountInGroup(Guid groupId, CancellationToken cancellationToken, Label label) => 
        await _repository.GetLabelReviewCountInGroup(groupId, cancellationToken, label);
    
    public async Task<Result<Dictionary<string, double>>> GetPositiveSrcPercentList(Guid groupId, CancellationToken cancellationToken) => 
        await _repository.GetPositiveSrcPercentList(groupId, cancellationToken);

    public async Task<Result<Review>> ParseOneReview(byte[] review, CancellationToken cancellationToken = default)
    {
        var csvResult = await _processReview.AnalyzeCsvAsync(review, "gg", cancellationToken);
        var input = CsvParser.ParseCsv(csvResult.Value);
        if(input.Count == 0)
            return Result.Failure<Review>("ml service error");
        
        var r = input[0];
        
        if (!Enum.TryParse<Label>(r.labels, out var label))
            return Result.Failure<Review>($"Unknown label '{r.labels}'");
        
        var reviewResult = Review.Create(r.text, label, r.src, r.confidence,  Guid.Empty);
        return reviewResult;
    }
}