using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnalyticsService.Migrations
{
    /// <inheritdoc />
    public partial class InitAnalytics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EventCounts",
                columns: table => new
                {
                    EventType = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Count = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventCounts", x => x.EventType);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventCounts");
        }
    }
}
