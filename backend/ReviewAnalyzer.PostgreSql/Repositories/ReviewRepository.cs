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

    public async Task<Result<IEnumerable<ReviewEntity>>> GetReviewsByGroupId(Guid groupId, int count, CancellationToken cancellationToken)
    {
        IQueryable<ReviewEntity> query = _context.Reviews
            .AsNoTracking()
            .Where(r => r.GroupId == groupId)
            .OrderBy(r => r.Index);

        if (count > 0)
            query = query.Take(count);

        var reviewEntities = await query.ToListAsync(cancellationToken);

        if (reviewEntities.Count == 0)
            return Result.Failure<IEnumerable<ReviewEntity>>("No reviews found for the specified group ID.");

        return Result.Success<IEnumerable<ReviewEntity>>(reviewEntities);
    }

    public Task<Result> AddReviewAsync(ReviewEntity reviewEntity, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<Result> AddReviewsAsync(IEnumerable<ReviewEntity> reviewEntity, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<Result<IEnumerable<ReviewEntity>>> GetReviewsByTitle(
        string title,
        int count,
        CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.Reviews
                .Where(r => EF.Functions.ILike(r.Text, $"%{title}%"));
            if (count > 0)
                query = query.Take(count);
            var reviews = await query
                .OrderBy(r => r.Id)
                .ToListAsync(cancellationToken);

            if (reviews.Count == 0)
                return Result.Failure<IEnumerable<ReviewEntity>>("No reviews found.");
            
            return Result.Success<IEnumerable<ReviewEntity>>(reviews);
        }
        catch (Exception ex)
        {
            return Result.Failure<IEnumerable<ReviewEntity>>(ex.Message);
        }
    }

    public async Task<Result<int>> GetReviewCount(CancellationToken cancellationToken)
    {
        var result = await _context.Reviews.CountAsync(cancellationToken: cancellationToken);
        return Result.Success(result);
    }
}