using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Appilico.Market.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddClaimAndRealDataFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Providers_BusinessName_City",
                table: "Providers");

            migrationBuilder.AlterColumn<string>(
                name: "ProviderReply",
                table: "Reviews",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClaimedAt",
                table: "Providers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClaimedByUserId",
                table: "Providers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DataSource",
                table: "Providers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FullAddress",
                table: "Providers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasRealData",
                table: "Providers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsClaimed",
                table: "Providers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Tagline",
                table: "Providers",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Providers_BusinessName_City",
                table: "Providers",
                columns: new[] { "BusinessName", "City" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Providers_BusinessName_City",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "ClaimedAt",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "ClaimedByUserId",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "DataSource",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "FullAddress",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "HasRealData",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "IsClaimed",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "Tagline",
                table: "Providers");

            migrationBuilder.AlterColumn<string>(
                name: "ProviderReply",
                table: "Reviews",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Providers_BusinessName_City",
                table: "Providers",
                columns: new[] { "BusinessName", "City" })
                .Annotation("Npgsql:IndexMethod", "gin")
                .Annotation("Npgsql:TsVectorConfig", "english");
        }
    }
}
