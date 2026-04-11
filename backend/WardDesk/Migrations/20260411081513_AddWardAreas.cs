using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WardDesk.Migrations
{
    /// <inheritdoc />
    public partial class AddWardAreas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ward_addresses");

            migrationBuilder.DropTable(
                name: "wards");

            migrationBuilder.CreateTable(
                name: "ward_areas",
                columns: table => new
                {
                    ward_area_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    address_name = table.Column<string>(type: "text", nullable: false),
                    ward_from = table.Column<int>(type: "integer", nullable: false),
                    ward_to = table.Column<int>(type: "integer", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ward_areas", x => x.ward_area_id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ward_areas");

            migrationBuilder.CreateTable(
                name: "wards",
                columns: table => new
                {
                    ward_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    ward_number = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wards", x => x.ward_id);
                });

            migrationBuilder.CreateTable(
                name: "ward_addresses",
                columns: table => new
                {
                    ward_address_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ward_id = table.Column<int>(type: "integer", nullable: false),
                    address_name = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ward_addresses", x => x.ward_address_id);
                    table.ForeignKey(
                        name: "FK_ward_addresses_wards_ward_id",
                        column: x => x.ward_id,
                        principalTable: "wards",
                        principalColumn: "ward_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ward_addresses_ward_id",
                table: "ward_addresses",
                column: "ward_id");
        }
    }
}
