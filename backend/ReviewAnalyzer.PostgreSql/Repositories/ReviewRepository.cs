using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using ReviewAnalyzer.PostgreSql.Model;

namespace ReviewAnalyzer.PostgreSql.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly ReviewDbContext _context;

    public ReviewRepository(ReviewDbContext context)
    {
        _context = context;
    }

    public async Task<Result<IEnumerable<ReviewEntity>>> GetReviewsByGroupId(Guid groupId, CancellationToken cancellationToken)
    {
        var reviewEntities = await _context.Reviews.AsNoTracking()
            .Where(r => r.Group!.Id == groupId)
            .ToListAsync(cancellationToken: cancellationToken);

        if (reviewEntities.Count == 0)
            return Result.Failure<IEnumerable<ReviewEntity>>("No reviews found for the specified group ID.");
        
        return Result.Success<IEnumerable<ReviewEntity>>(reviewEntities);
    }
    
    public async Task<Result> AddReviewAsync(ReviewEntity reviewEntity, CancellationToken cancellationToken)
    {
        await _context.Reviews.AddAsync(reviewEntity, cancellationToken);
        var result = await _context.SaveChangesAsync(cancellationToken);
        if(result <= 0)
            return Result.Failure("Failed to save the review.");
        
        return Result.Success();
    }
    
    public async Task<Result> AddReviewsAsync(IEnumerable<ReviewEntity> reviewEntity, CancellationToken cancellationToken)
    {
        await _context.AddRangeAsync(reviewEntity, cancellationToken);
        var result = await _context.SaveChangesAsync(cancellationToken);
        if(result <= 0)
            return Result.Failure("Failed to save the reviews.");
        
        return Result.Success();
    }
}