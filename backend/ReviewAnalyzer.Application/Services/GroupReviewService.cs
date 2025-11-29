using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using CSharpFunctionalExtensions;
using CsvHelper;
using CsvHelper.Configuration;
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

    public async Task<Result> AddGroupReview(byte[] csvBytes, string fileName, CancellationToken cancellationToken)
    {
        var csvResult = await _processReview.AnalyzeCsvAsync(csvBytes, fileName, cancellationToken);
        var input = ParseCsv(csvResult.Value);

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
            Confidence = 1,
            GroupId = groupEntity.Id,
            Index = r.ID,
            Src = r.src,
            Group = groupEntity
        });
        groupEntity.Reviews.AddRange(listReview);
        
        var result = await _groupRepository.AddGroupAsync(groupEntity, cancellationToken);
        if (result.IsFailure)
            return Result.Failure(result.Error);
        
        return Result.Success("Group review added");
    }

    public async Task<Result<IEnumerable<ReviewGroupEntity>>> GetAllGroups(CancellationToken cancellationToken)
    {
        var result = await _groupRepository.GetAllGroupsWithoutReviews();
        if(result.IsFailure)
            return Result.Failure<IEnumerable<ReviewGroupEntity>>(result.Error);
        
        return Result.Success(result.Value);
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
        public string label { get; set; }
    }
}