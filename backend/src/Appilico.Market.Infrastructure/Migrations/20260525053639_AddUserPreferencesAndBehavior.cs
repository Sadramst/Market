using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Appilico.Market.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserPreferencesAndBehavior : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserBehaviorEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    SessionId = table.Column<string>(type: "text", nullable: true),
                    EventType = table.Column<string>(type: "text", nullable: false),
                    EntityType = table.Column<string>(type: "text", nullable: true),
                    EntitySlug = table.Column<string>(type: "text", nullable: true),
                    CategorySlug = table.Column<string>(type: "text", nullable: true),
                    SuburbSlug = table.Column<string>(type: "text", nullable: true),
                    MarketplaceType = table.Column<int>(type: "integer", nullable: true),
                    SearchQuery = table.Column<string>(type: "text", nullable: true),
                    ReferrerPage = table.Column<string>(type: "text", nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    Latitude = table.Column<double>(type: "double precision", nullable: true),
                    Longitude = table.Column<double>(type: "double precision", nullable: true),
                    OccurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBehaviorEvents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserPreferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    PreferredSuburbSlug = table.Column<string>(type: "text", nullable: true),
                    PreferredSuburbName = table.Column<string>(type: "text", nullable: true),
                    PreferredPostCode = table.Column<string>(type: "text", nullable: true),
                    UserLatitude = table.Column<double>(type: "double precision", nullable: true),
                    UserLongitude = table.Column<double>(type: "double precision", nullable: true),
                    FavouriteCategories = table.Column<string>(type: "text", nullable: true),
                    LastMarketplaceType = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserPreferences_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserBehaviorEvents_EventType",
                table: "UserBehaviorEvents",
                column: "EventType");

            migrationBuilder.CreateIndex(
                name: "IX_UserBehaviorEvents_SessionId_OccurredAt",
                table: "UserBehaviorEvents",
                columns: new[] { "SessionId", "OccurredAt" });

            migrationBuilder.CreateIndex(
                name: "IX_UserBehaviorEvents_UserId_OccurredAt",
                table: "UserBehaviorEvents",
                columns: new[] { "UserId", "OccurredAt" });

            migrationBuilder.CreateIndex(
                name: "IX_UserPreferences_UserId",
                table: "UserPreferences",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserBehaviorEvents");

            migrationBuilder.DropTable(
                name: "UserPreferences");
        }
    }
}
