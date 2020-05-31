using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Aspian.Domain.PostModel
{
    public class PostConfig : IEntityTypeConfiguration<Post>
    {
        public void Configure(EntityTypeBuilder<Post> builder)
        {
            var converter = new EnumToStringConverter<PostStatusEnum>();
            builder
                .Property(p => p.PostStatus)
                .HasConversion(converter);
                
            builder
                .HasOne(p => p.CreatedBy)
                .WithMany(u => u.CreatedPosts)
                .HasForeignKey(p => p.CreatedById);

            builder
                .HasOne(p => p.ModifiedBy)
                .WithMany(u => u.ModifiedPosts)
                .HasForeignKey(p => p.ModifiedById);

            builder
                .HasMany(p => p.ChildPosts)
                .WithOne(p => p.Parent)
                .HasForeignKey(p => p.ParentId);
        }
    }
}