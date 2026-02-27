using Microsoft.EntityFrameworkCore;
using WardDesk.Models;

namespace WardDesk.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<ComplaintCategory> ComplaintCategories { get; set; }
        public DbSet<ComplaintStatus> ComplaintStatuses { get; set; }
        public DbSet<ComplaintPhoto> ComplaintPhotos { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<Complaint>()
                .HasOne(c => c.Citizen)
                .WithMany()
                .HasForeignKey(c => c.CitizenId)
                .OnDelete(DeleteBehavior.Restrict);

            
            
            modelBuilder.Entity<Complaint>()
                .HasOne(c => c.Verifier)
                .WithMany()
                .HasForeignKey(c => c.VerifiedBy)
                .OnDelete(DeleteBehavior.SetNull);

           
            modelBuilder.Entity<ComplaintStatus>().HasData(
                new ComplaintStatus { StatusId = 1, StatusName = "pending", StatusDescription = "Complaint has been submitted" },
                new ComplaintStatus { StatusId = 2, StatusName = "verified", StatusDescription = "Complaint verified by admin" },
                new ComplaintStatus { StatusId = 3, StatusName = "assigned", StatusDescription = "Technician has been assigned" },
                new ComplaintStatus { StatusId = 4, StatusName = "in_progress", StatusDescription = "Work is in progress" },
                new ComplaintStatus { StatusId = 5, StatusName = "completed", StatusDescription = "Work completed by technician" },
                new ComplaintStatus { StatusId = 6, StatusName = "resolved", StatusDescription = "Complaint resolved and closed" },
                new ComplaintStatus { StatusId = 7, StatusName = "rejected", StatusDescription = "Complaint rejected by admin" }
            );

            
            modelBuilder.Entity<ComplaintCategory>().HasData(
                new ComplaintCategory { CategoryId = 1, CategoryName = "Road Damage", CategoryDescription = "Potholes, cracks, broken roads" },
                new ComplaintCategory { CategoryId = 2, CategoryName = "Water Supply", CategoryDescription = "Water leaks, no water, contamination" },
                new ComplaintCategory { CategoryId = 3, CategoryName = "Electricity", CategoryDescription = "Power cuts, broken poles, wire issues" },
                new ComplaintCategory { CategoryId = 4, CategoryName = "Sanitation", CategoryDescription = "Garbage, drainage, sewage problems" },
                new ComplaintCategory { CategoryId = 5, CategoryName = "Public Safety", CategoryDescription = "Street lights, unsafe structures" },
                new ComplaintCategory { CategoryId = 6, CategoryName = "Other", CategoryDescription = "Other civic issues" }
            );
        }
    }
}