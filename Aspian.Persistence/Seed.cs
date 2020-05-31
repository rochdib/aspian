using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aspian.Domain.CommentModel;
using Aspian.Domain.OptionModel;
using Aspian.Domain.PostModel;
using Aspian.Domain.SiteModel;
using Aspian.Domain.TaxonomyModel;
using Aspian.Domain.UserModel;
using Microsoft.AspNetCore.Identity;

namespace Aspian.Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<User> userManager)
        {
            // Seeding Users
            if (!userManager.Users.Any())
            {
                var users = new List<User>
                {
                    new User
                    {
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@test.com"
                    },
                    new User
                    {
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com"
                    },
                    new User
                    {
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@test.com"
                    }
                };
                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }

            // Sedding Sites
            if(!context.Sites.Any())
            {
                var sites = new List<Site>
                {
                    new Site {
                        Id = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                        Domain = "localhost",
                        Path = "/",
                        Registered = DateTime.UtcNow,
                        SiteType = SiteTypeEnum.Blog
                    },
                    new Site {
                        Id = Guid.Parse("134D3087-EFE9-4AB6-F13C-08D80310CDEE"),
                        Domain = "localhost",
                        Path = "/store",
                        Registered = DateTime.UtcNow,
                        SiteType = SiteTypeEnum.Store
                    },
                    new Site {
                        Id = Guid.Parse("5AE37FF3-C221-43D3-F13D-08D80310CDEE"),
                        Domain = "localhost",
                        Path = "/lms",
                        Registered = DateTime.UtcNow,
                        SiteType = SiteTypeEnum.LMS
                    },
                    new Site {
                        Id = Guid.Parse("B56877AE-FB1E-479C-F13E-08D80310CDEE"),
                        Domain = "localhost",
                        Path = "/ehealth",
                        Registered = DateTime.UtcNow,
                        SiteType = SiteTypeEnum.eHealth
                    }
                };

                context.Sites.AddRange(sites);
                context.SaveChanges();
            }

            // Seeding Posts
            if(!context.Posts.Any())
            {
                var posts = new List<Post>
                {
                    new Post {
                        Id = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD"),
                        Title = "Post Title 1",
                        Subtitle = "Post Subtitle 1",

                        Excerpt = "Lorem ipsum dolor sit amet consectetur adipisicing elit.",

                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia quam ducimus maiores magnam explicabo vitae, suscipit veniam! Laboriosam, eaque tempora consequatur quo quaerat impedit dolorem laudantium, ipsum nemo libero sed.",

                        Slug = "post-title-1",
                        PostStatus = PostStatusEnum.Publish,
                        CommentAllowed = true,
                        ViewCount = 23,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                    },
                    new Post {
                        Id = Guid.Parse("5D6BB51B-A118-4E05-6AA6-08D8034324CD"),
                        Title = "Post Title 2",
                        Subtitle = "Post Subtitle 2",

                        Excerpt = "Lorem ipsum dolor sit amet consectetur adipisicing elit.",

                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia quam ducimus maiores magnam explicabo vitae, suscipit veniam! Laboriosam, eaque tempora consequatur quo quaerat impedit dolorem laudantium, ipsum nemo libero sed.",

                        Slug = "post-title-2",
                        PostStatus = PostStatusEnum.Publish,
                        CommentAllowed = true,
                        ViewCount = 2,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                    },
                    new Post {
                        Id = Guid.Parse("04F5CCA9-2CCE-47BB-6AA7-08D8034324CD"),
                        Title = "Post Title 3",
                        Subtitle = "Post Subtitle 3",

                        Excerpt = "Lorem ipsum dolor sit amet consectetur adipisicing elit.",

                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia quam ducimus maiores magnam explicabo vitae, suscipit veniam! Laboriosam, eaque tempora consequatur quo quaerat impedit dolorem laudantium, ipsum nemo libero sed.",

                        Slug = "post-title-3",
                        PostStatus = PostStatusEnum.Publish,
                        CommentAllowed = true,
                        ViewCount = 12,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                    },
                    new Post {
                        Id = Guid.Parse("9BA88FA5-EA8B-4A69-6AA8-08D8034324CD"),
                        Title = "Post Title 4",
                        Subtitle = "Post Subtitle 4",

                        Excerpt = "Lorem ipsum dolor sit amet consectetur adipisicing elit.",

                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia quam ducimus maiores magnam explicabo vitae, suscipit veniam! Laboriosam, eaque tempora consequatur quo quaerat impedit dolorem laudantium, ipsum nemo libero sed.",

                        Slug = "post-title-4",
                        PostStatus = PostStatusEnum.Publish,
                        CommentAllowed = true,
                        ViewCount = 14,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                    },
                    new Post {
                        Id = Guid.Parse("5F331D14-851E-4137-6AA9-08D8034324CD"),
                        Title = "Post Title 5",
                        Subtitle = "Post Subtitle 5",

                        Excerpt = "Lorem ipsum dolor sit amet consectetur adipisicing elit.",

                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia quam ducimus maiores magnam explicabo vitae, suscipit veniam! Laboriosam, eaque tempora consequatur quo quaerat impedit dolorem laudantium, ipsum nemo libero sed.",

                        Slug = "post-title-5",
                        PostStatus = PostStatusEnum.Publish,
                        CommentAllowed = true,
                        ViewCount = 16,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                    }
                };

                context.Posts.AddRange(posts);
                context.SaveChanges();
            }

            // Seeding TermTaxonomies and Related Terms
            if (!context.TermTaxonomies.Any())
            {
                var termTaxonomies = new List<TermTaxonomy>
                {
                    new TermTaxonomy {
                        Id = Guid.Parse("D3BFEBD2-71B1-48DF-0285-08D803D1EA56"),
                        Taxonomy = TaxonomyEnum.category,
                        Term = new Term {
                            Name = "Category 1",
                            Slug = "category-1",
                            TermTaxonomyId = Guid.Parse("D3BFEBD2-71B1-48DF-0285-08D803D1EA56")
                        },
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE")
                    },
                    new TermTaxonomy {
                        Id = Guid.Parse("64893B00-5F9A-4B91-0286-08D803D1EA56"),
                        Taxonomy = TaxonomyEnum.category,
                        Term = new Term {
                            Name = "Category 2",
                            Slug = "category-2",
                            TermTaxonomyId = Guid.Parse("64893B00-5F9A-4B91-0286-08D803D1EA56")
                        },
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE")
                    },
                    new TermTaxonomy {
                        Id = Guid.Parse("9926607F-D704-4724-0287-08D803D1EA56"),
                        Taxonomy = TaxonomyEnum.category,
                        Term = new Term {
                            Name = "Category 3",
                            Slug = "category-3",
                            TermTaxonomyId = Guid.Parse("9926607F-D704-4724-0287-08D803D1EA56")
                        },
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE")
                    },
                    new TermTaxonomy {
                        Id = Guid.Parse("A4A4FB1A-38A4-4B3B-0288-08D803D1EA56"),
                        Taxonomy = TaxonomyEnum.category,
                        Term = new Term {
                            Name = "Category 4",
                            Slug = "category-4",
                            TermTaxonomyId = Guid.Parse("A4A4FB1A-38A4-4B3B-0288-08D803D1EA56")
                        },
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE")
                    },
                    new TermTaxonomy {
                        Id = Guid.Parse("4C35DEFF-E65C-41EF-0289-08D803D1EA56"),
                        Taxonomy = TaxonomyEnum.tag,
                        Term = new Term {
                            Name = "Tag_1",
                            Slug = "tag-1",
                            TermTaxonomyId = Guid.Parse("4C35DEFF-E65C-41EF-0289-08D803D1EA56")
                        },
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE")
                    },
                    new TermTaxonomy {
                        Id = Guid.Parse("7EBB45E6-A80B-484E-028A-08D803D1EA56"),
                        Taxonomy = TaxonomyEnum.tag,
                        Term = new Term {
                            Name = "Tag_2",
                            Slug = "tag-2",
                            TermTaxonomyId = Guid.Parse("7EBB45E6-A80B-484E-028A-08D803D1EA56")
                        },
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE")
                    },
                    new TermTaxonomy {
                        Id = Guid.Parse("6C1EC7B9-F7C4-43F2-028B-08D803D1EA56"),
                        Taxonomy = TaxonomyEnum.tag,
                        Term = new Term {
                            Name = "Tag_3",
                            Slug = "tag-3",
                            TermTaxonomyId = Guid.Parse("6C1EC7B9-F7C4-43F2-028B-08D803D1EA56")
                        },
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE")
                    },
                };

                context.TermTaxonomies.AddRange(termTaxonomies);
                context.SaveChanges();
            }

            // Seeding TermPosts
            if (!context.TermPosts.Any())
            {
                var termPosts = new List<TermPost>
                {
                    new TermPost {
                        PostId = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD"),
                        TermTaxonomyId = Guid.Parse("D3BFEBD2-71B1-48DF-0285-08D803D1EA56")
                    },
                    new TermPost {
                        PostId = Guid.Parse("5D6BB51B-A118-4E05-6AA6-08D8034324CD"),
                        TermTaxonomyId = Guid.Parse("D3BFEBD2-71B1-48DF-0285-08D803D1EA56")
                    },
                    new TermPost {
                        PostId = Guid.Parse("04F5CCA9-2CCE-47BB-6AA7-08D8034324CD"),
                        TermTaxonomyId = Guid.Parse("64893B00-5F9A-4B91-0286-08D803D1EA56")
                    },
                    new TermPost {
                        PostId = Guid.Parse("9BA88FA5-EA8B-4A69-6AA8-08D8034324CD"),
                        TermTaxonomyId = Guid.Parse("9926607F-D704-4724-0287-08D803D1EA56")
                    },
                    new TermPost {
                        PostId = Guid.Parse("5F331D14-851E-4137-6AA9-08D8034324CD"),
                        TermTaxonomyId = Guid.Parse("A4A4FB1A-38A4-4B3B-0288-08D803D1EA56")
                    },
                    new TermPost {
                        PostId = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD"),
                        TermTaxonomyId = Guid.Parse("6C1EC7B9-F7C4-43F2-028B-08D803D1EA56")
                    },
                    new TermPost {
                        PostId = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD"),
                        TermTaxonomyId = Guid.Parse("7EBB45E6-A80B-484E-028A-08D803D1EA56")
                    }
                };

                context.TermPosts.AddRange(termPosts);
                context.SaveChanges();
            }

            // Seeding Options
            if (!context.Options.Any())
            {
                var options = new List<Option>
                {
                    new Option {
                        Section = SectionEnum.Activity,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                        Optionmetas = new List<Optionmeta> {
                            new Optionmeta {
                                Key = KeyEnum.Activity__LoggingActivities,
                                KeyDescription = "Enable/Disable Ativity logging",
                                Value = ValueEnum.Activity__LoggingActivities_Enable,
                                ValueDescription = "Enabled"
                            },
                            new Optionmeta {
                                Key = KeyEnum.Activity__PruningDate,
                                KeyDescription = "Pruning Activity logs date",
                                Value = ValueEnum.Activity__PruningDate_EveryMonth,
                                ValueDescription = "Every month"
                            }
                        }
                    },
                };

                context.Options.AddRange(options);
                context.SaveChanges();
            }

            // Seeding comments
            if (!context.Comments.Any())
            {
                var comments = new List<Comment>
                {
                    new Comment {
                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia quam ducimus maiores magnam explicabo vitae, suscipit veniam! Laboriosam, eaque tempora consequatur quo quaerat impedit dolorem laudantium, ipsum nemo libero sed.",
                        Approved = true,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                        PostId = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD"),

                        Replies = new List<Comment> {
                            new Comment {
                                Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
                                Approved = true,
                                SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                                PostId = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD")
                            },
                            new Comment {
                                Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
                                Approved = true,
                                SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                                PostId = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD")
                            }
                        }
                    },
                    new Comment {
                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
                        Approved = true,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                        PostId = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD"),

                        Replies = new List<Comment> {
                            new Comment {
                                Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
                                Approved = true,
                                SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                                PostId = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD")
                            }
                        }
                    },
                    new Comment {
                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia quam ducimus maiores magnam explicabo vitae, suscipit veniam! Laboriosam, eaque tempora consequatur quo quaerat impedit dolorem laudantium, ipsum nemo libero sed.",
                        Approved = true,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                        PostId = Guid.Parse("04F5CCA9-2CCE-47BB-6AA7-08D8034324CD")
                    },
                    new Comment {
                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
                        Approved = true,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                        PostId = Guid.Parse("04F5CCA9-2CCE-47BB-6AA7-08D8034324CD"),

                        Replies = new List<Comment> {
                            new Comment {
                                Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
                                Approved = true,
                                SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                                PostId = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD")
                            },
                            new Comment {
                                Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
                                Approved = true,
                                SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                                PostId = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD")
                            },
                            new Comment {
                                Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
                                Approved = true,
                                SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                                PostId = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD")
                            },
                            new Comment {
                                Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
                                Approved = true,
                                SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                                PostId = Guid.Parse("751480BA-1717-4FB6-6AA5-08D8034324CD")
                            }
                        }
                    },
                    new Comment {
                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia quam ducimus maiores magnam explicabo vitae, suscipit veniam! Laboriosam, eaque tempora consequatur quo quaerat impedit dolorem laudantium, ipsum nemo libero sed.",
                        Approved = true,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                        PostId = Guid.Parse("9BA88FA5-EA8B-4A69-6AA8-08D8034324CD")
                    },
                    new Comment {
                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
                        Approved = true,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                        PostId = Guid.Parse("5F331D14-851E-4137-6AA9-08D8034324CD")
                    },
                    new Comment {
                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia quam ducimus maiores magnam explicabo vitae, suscipit veniam! Laboriosam, eaque tempora consequatur quo quaerat impedit dolorem laudantium, ipsum nemo libero sed.",
                        Approved = true,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                        PostId = Guid.Parse("5F331D14-851E-4137-6AA9-08D8034324CD")
                    },
                    new Comment {
                        Content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
                        Approved = true,
                        SiteId = Guid.Parse("B613403D-3C49-4263-F13B-08D80310CDEE"),
                        PostId = Guid.Parse("5F331D14-851E-4137-6AA9-08D8034324CD")
                    }
                };

                context.Comments.AddRange(comments);
                context.SaveChanges();
            }
        }
    }
}