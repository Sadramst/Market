using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Appilico.Market.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEnquiriesAndAdminOperations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reviews_UserId_ProviderId",
                table: "Reviews");

            migrationBuilder.CreateTable(
                name: "Enquiries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProviderId = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerName = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    CustomerEmail = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CustomerPhone = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    Message = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    ServiceInterest = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ReadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RepliedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProviderReply = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Enquiries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Enquiries_Providers_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "Providers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId_ProviderId",
                table: "Reviews",
                columns: new[] { "UserId", "ProviderId" });

            migrationBuilder.CreateIndex(
                name: "IX_Enquiries_CreatedAt",
                table: "Enquiries",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Enquiries_ProviderId",
                table: "Enquiries",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_Enquiries_ProviderId_Status",
                table: "Enquiries",
                columns: new[] { "ProviderId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Enquiries_Status",
                table: "Enquiries",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Enquiries");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_UserId_ProviderId",
                table: "Reviews");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId_ProviderId",
                table: "Reviews",
                columns: new[] { "UserId", "ProviderId" },
                unique: true);
        }
    }
}
