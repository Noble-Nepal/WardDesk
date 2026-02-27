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
            

            //modelBuilder.Entity<User>()
            //    .HasOne(u => u.Role)
            //    .WithMany()
            //    .HasForeignKey(u => u.RoleId)
            //    .OnDelete(DeleteBehavior.Cascade);

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

           
            
        }
    }
}