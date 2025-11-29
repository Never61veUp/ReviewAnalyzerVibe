using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using CSharpFunctionalExtensions;
using CsvHelper;
using CsvHelper.Configuration;
using ReviewAnalyzer.Core.Model;
using ReviewAnalyzer.PostgreSql.Model;
using ReviewAnalyzer.PostgreSql.Repositories;

namespace ReviewAnalyzer.Application.Services;

public class GroupReviewService : IGroupReviewService
{
    private readonly IProcessReview _processReview;
    private readonly IGroupRepository _groupRepository;

    public GroupReviewService(IProcessReview processReview, IGroupRepository groupRepository)
    {
        _processReview = processReview;
        _groupRepository = groupRepository;
    }

    public async Task<Result<Guid>> AddGroupReview(byte[] csvBytes, string fileName, CancellationToken cancellationToken)
    {
        var csvResult = await _processReview.AnalyzeCsvAsync(csvBytes, fileName, cancellationToken);
        var input = ParseCsv(csvResult.Value);

        if(input.Count == 0)
            return Result.Failure<Guid>("ml service error");
        
        var groupEntity = new ReviewGroupEntity()
        {
            Date = DateTime.UtcNow,
            Id = Guid.NewGuid(),
            Name = fileName,
            Reviews = []
        };
        
        var listReview = input.Select(r => new ReviewEntity()
        {
            Id = Guid.NewGuid(),
            Text = r.text,
            Labels = Enum.Parse<Label>(r.labels),
            Confidence = r.confidence,
            GroupId = groupEntity.Id,
            Index = r.ID,
            Src = r.src,
            Group = groupEntity
        });
        groupEntity.Reviews.AddRange(listReview);
        
        var result = await _groupRepository.AddGroupAsync(groupEntity, cancellationToken);
        if (result.IsFailure)
            return Result.Failure<Guid>(result.Error);
        
        return Result.Success<Guid>(groupEntity.Id);
    }

    public async Task<Result<IEnumerable<ReviewGroup>>> GetAllGroups(CancellationToken cancellationToken)
    {
        var result = await _groupRepository.GetAllGroupsWithoutReviews();
        if(result.IsFailure)
            return Result.Failure<IEnumerable<ReviewGroup>>(result.Error);

        var groups = result.Value.Select(g =>
            ReviewGroup.Create(g.Name, [], g.Date, 1, g.ReviewCount, g.Id).Value);
        
        return Result.Success(groups);
    }
    
    public List<ReviewInput> ParseCsv(byte[] bytes)
    {
        using var stream = new MemoryStream(bytes);
        using var reader = new StreamReader(stream);

        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            Delimiter = ","
        };

        using var csv = new CsvReader(reader, config);

        return csv.GetRecords<ReviewInput>().ToList();
    }
    
    public class ReviewInput
    {
        public int ID { get; set; }
        public string text { get; set; }
        public string src { get; set; }
        public string labels { get; set; }
        public double confidence { get; set; }
    }
}