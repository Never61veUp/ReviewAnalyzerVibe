namespace ReviewAnalyzer.PostgreSql.Model;

public class ReviewGroupEntity
{
    public Guid Id { get; set; }

    public string? Name { get; set; }
    public DateTime Date { get; set; }
    
    public required List<ReviewEntity> Reviews { get; set; }
}