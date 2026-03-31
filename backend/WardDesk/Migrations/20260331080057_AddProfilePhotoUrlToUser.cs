using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WardDesk.Migrations
{
    /// <inheritdoc />
    public partial class AddProfilePhotoUrlToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "profile_photo_url",
                table: "users",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "profile_photo_url",
                table: "users");
        }
    }
}
