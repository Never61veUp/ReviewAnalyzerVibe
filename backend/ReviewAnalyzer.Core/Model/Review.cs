using CSharpFunctionalExtensions;

namespace ReviewAnalyzer.Core.Model;

public sealed class Review : Entity<Guid>
{
    private Review(string text, Label label, string src, double confidence, Guid? id) : base(id ?? Guid.NewGuid())
    {
        Text = text;
        Label = label;
        Src = src;
        Confidence = confidence;
    }

    public string Text { get; private set; }
    public Label Label { get; private set; }
    public string Src { get; private set; }
    public double Confidence { get; private set; }
    
    public Result SetLabel(Label label)
    {
        //validation
        Label = label;
        return Result.Success();
    }
    
    public static Result<Review> Create(string text, Label label, string src, double confidence, Guid? id)
    {
        var textResult = ValidateText(text);
        

        var validation = Result.Combine(textResult);
        if (validation.IsFailure)
            return Result.Failure<Review>(validation.Error);

        return Result.Success(new Review(text, label, src, confidence, id));
    }

    private static Result ValidateText(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return Result.Failure("Text cannot be empty");

        if (text.Length < 5)
            return Result.Failure("Text must be at least 5 characters");

        return Result.Success();
    }

    private static Result ValidateConfidence(double confidence)
    {
        if (confidence < 0 || confidence > 1)
            return Result.Failure("Confidence must be between 0 and 1");

        return Result.Success();
    }
}