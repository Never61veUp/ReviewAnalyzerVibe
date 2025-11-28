using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReviewAnalyzer.PostgreSql.Model;

namespace ReviewAnalyzer.PostgreSql.Configuration;

public class ReviewGroupConfiguration : IEntityTypeConfiguration<ReviewGroupEntity>
{
    public void Configure(EntityTypeBuilder<ReviewGroupEntity> builder)
    {
        builder.ToTable("ReviewGroup");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .ValueGeneratedNever();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Date)
            .IsRequired();

        builder.HasMany(x => x.Reviews)
            .WithOne(r => r.Group)
            .HasForeignKey(r => r.GroupId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}