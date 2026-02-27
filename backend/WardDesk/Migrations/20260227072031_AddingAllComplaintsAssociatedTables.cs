using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WardDesk.Migrations
{
    /// <inheritdoc />
    public partial class AddingAllComplaintsAssociatedTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "complaint_categories",
                columns: table => new
                {
                    category_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    category_name = table.Column<string>(type: "text", nullable: false),
                    category_description = table.Column<string>(type: "text", nullable: true),
                    safety_guidelines = table.Column<string>(type: "text", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_complaint_categories", x => x.category_id);
                });

            migrationBuilder.CreateTable(
                name: "complaint_status",
                columns: table => new
                {
                    status_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    status_name = table.Column<string>(type: "text", nullable: false),
                    status_description = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_complaint_status", x => x.status_id);
                });

            migrationBuilder.CreateTable(
                name: "complaints",
                columns: table => new
                {
                    complaint_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tracking_id = table.Column<string>(type: "text", nullable: false),
                    citizen_id = table.Column<Guid>(type: "uuid", nullable: false),
                    category_id = table.Column<int>(type: "integer", nullable: false),
                    status_id = table.Column<int>(type: "integer", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    latitude = table.Column<decimal>(type: "numeric", nullable: true),
                    longitude = table.Column<decimal>(type: "numeric", nullable: true),
                    location_address = table.Column<string>(type: "text", nullable: true),
                    ward_number = table.Column<int>(type: "integer", nullable: false),
                    priority_level = table.Column<string>(type: "text", nullable: false),
                    upvote_count = table.Column<int>(type: "integer", nullable: false),
                    downvote_count = table.Column<int>(type: "integer", nullable: false),
                    net_votes = table.Column<int>(type: "integer", nullable: false),
                    is_verified = table.Column<bool>(type: "boolean", nullable: false),
                    verified_by = table.Column<Guid>(type: "uuid", nullable: true),
                    verified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    resolved_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_complaints", x => x.complaint_id);
                    table.ForeignKey(
                        name: "FK_complaints_complaint_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "complaint_categories",
                        principalColumn: "category_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_complaints_complaint_status_status_id",
                        column: x => x.status_id,
                        principalTable: "complaint_status",
                        principalColumn: "status_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_complaints_users_citizen_id",
                        column: x => x.citizen_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_complaints_users_verified_by",
                        column: x => x.verified_by,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "complaint_photos",
                columns: table => new
                {
                    photo_id = table.Column<Guid>(type: "uuid", nullable: false),
                    complaint_id = table.Column<Guid>(type: "uuid", nullable: false),
                    uploaded_by = table.Column<Guid>(type: "uuid", nullable: false),
                    photo_url = table.Column<string>(type: "text", nullable: false),
                    photo_type = table.Column<string>(type: "text", nullable: false),
                    uploaded_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_complaint_photos", x => x.photo_id);
                    table.ForeignKey(
                        name: "FK_complaint_photos_complaints_complaint_id",
                        column: x => x.complaint_id,
                        principalTable: "complaints",
                        principalColumn: "complaint_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_complaint_photos_users_uploaded_by",
                        column: x => x.uploaded_by,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_complaint_photos_complaint_id",
                table: "complaint_photos",
                column: "complaint_id");

            migrationBuilder.CreateIndex(
                name: "IX_complaint_photos_uploaded_by",
                table: "complaint_photos",
                column: "uploaded_by");

            migrationBuilder.CreateIndex(
                name: "IX_complaints_category_id",
                table: "complaints",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_complaints_citizen_id",
                table: "complaints",
                column: "citizen_id");

            migrationBuilder.CreateIndex(
                name: "IX_complaints_status_id",
                table: "complaints",
                column: "status_id");

            migrationBuilder.CreateIndex(
                name: "IX_complaints_verified_by",
                table: "complaints",
                column: "verified_by");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "complaint_photos");

            migrationBuilder.DropTable(
                name: "complaints");

            migrationBuilder.DropTable(
                name: "complaint_categories");

            migrationBuilder.DropTable(
                name: "complaint_status");
        }
    }
}
