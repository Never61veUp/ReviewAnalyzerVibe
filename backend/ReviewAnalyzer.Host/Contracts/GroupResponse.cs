using ReviewAnalyzer.Core.Model;

namespace ReviewAnalyzer.Host.Contracts;

public record GroupResponse(Guid Id, string Name, DateTime Date, int ReviewCount)
{
   public static GroupResponse FromDomain(ReviewGroup domain)
   {
      return new GroupResponse(domain.Id, domain.Name, domain.Date, domain.ReviewsCount);
   }
}