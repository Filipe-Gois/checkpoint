using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace web_api_checkpoint.Migrations
{
    /// <inheritdoc />
    public partial class correcaodejustificativadefalta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_JustificativaFalta_StatusValidacao",
                table: "JustificativaFalta");

            migrationBuilder.DropColumn(
                name: "ValidadoPorIA",
                table: "JustificativaFalta");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ValidadoPorIA",
                table: "JustificativaFalta",
                type: "BIT",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_JustificativaFalta_StatusValidacao",
                table: "JustificativaFalta",
                column: "StatusValidacao",
                unique: true);
        }
    }
}
