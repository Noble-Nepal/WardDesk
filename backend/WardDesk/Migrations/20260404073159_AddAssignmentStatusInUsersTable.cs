using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WardDesk.Migrations
{
    /// <inheritdoc />
    public partial class AddAssignmentStatusInUsersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "assignment_status",
                table: "users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "assignment_status",
                table: "users");
        }
    }
}
