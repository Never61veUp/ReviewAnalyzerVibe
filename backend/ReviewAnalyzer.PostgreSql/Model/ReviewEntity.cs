using Microsoft.EntityFrameworkCore;
using ReviewAnalyzer.Core.Model;

namespace ReviewAnalyzer.PostgreSql.Model;

public class ReviewEntity
{
    public Guid Id { get; set; }
    public int Index { get; set; }
    public Guid GroupId { get; set; }
    
    public required string Text { get; set; }
    public Label Labels { get; set; }
    public string Src { get; set; }
    public double Confidence { get; set; }
    
    public ReviewGroupEntity? Group { get; set; }
}