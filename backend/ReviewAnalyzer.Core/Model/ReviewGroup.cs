using CSharpFunctionalExtensions;

namespace ReviewAnalyzer.Core.Model;

public sealed class ReviewGroup : Entity<Guid>
{
    private ReviewGroup(string name, IEnumerable<Review> reviews, DateTime date, double generalScore, int reviewsCount, Guid? id) : base(
        id ?? Guid.NewGuid())
    {
        Name = name;
        Reviews = reviews;
        Date = DateTime.UtcNow;
        GeneralScore = generalScore;
        ReviewsCount = reviewsCount;
    }

    public string Name { get; private set; }
    public IEnumerable<Review> Reviews { get; private set; }
    public DateTime Date { get; private set; }
    public double GeneralScore { get; private set; }
    public int ReviewsCount { get; set; }

    public static Result<ReviewGroup> Create(string name, IEnumerable<Review> reviews, DateTime date, double generalScore, int reviewsCount,
        Guid? id)
    {
        var dateResult = ValidateDate(date);
        var scoreResult = ValidateGeneralScore(generalScore);

        var validation = Result.Combine(dateResult, scoreResult);

        if (validation.IsFailure)
            return Result.Failure<ReviewGroup>(validation.Error);

        return Result.Success(new ReviewGroup(name, reviews, date, generalScore, reviewsCount, id));
    }

    private static Result ValidateDate(DateTime date)
    {
        if (date > DateTime.UtcNow)
            return Result.Failure("Date cannot be in the future");

        return Result.Success();
    }

    private static Result ValidateGeneralScore(double score)
    {
        if (score is < 0 or > 1)
            return Result.Failure("GeneralScore must be between 0 and 1");

        return Result.Success();
    }
}