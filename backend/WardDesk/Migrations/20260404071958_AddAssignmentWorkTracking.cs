using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WardDesk.Migrations
{
    /// <inheritdoc />
    public partial class AddAssignmentWorkTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "work_status",
                table: "assignments",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "work_status",
                table: "assignments");
        }
    }
}
