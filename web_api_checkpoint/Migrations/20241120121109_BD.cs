using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace web_api_checkpoint.Migrations
{
    /// <inheritdoc />
    public partial class BD : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CalendarioLetivo",
                columns: table => new
                {
                    IdCalendarioLetivo = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Data = table.Column<DateTime>(type: "DATE", nullable: false),
                    IsDiaLetivo = table.Column<bool>(type: "BIT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CalendarioLetivo", x => x.IdCalendarioLetivo);
                });

            migrationBuilder.CreateTable(
                name: "Expediente",
                columns: table => new
                {
                    IdExpediente = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Descricao = table.Column<string>(type: "VARCHAR(100)", nullable: true),
                    InicioExpediente = table.Column<TimeOnly>(type: "TIME", nullable: false),
                    FimExpediente = table.Column<TimeOnly>(type: "TIME", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Expediente", x => x.IdExpediente);
                });

            migrationBuilder.CreateTable(
                name: "Midia",
                columns: table => new
                {
                    IdMidia = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Url = table.Column<string>(type: "TEXT", nullable: true),
                    BlobStorageName = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Midia", x => x.IdMidia);
                });

            migrationBuilder.CreateTable(
                name: "Squad",
                columns: table => new
                {
                    IdSquad = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "VARCHAR(100)", nullable: false),
                    IsActive = table.Column<bool>(type: "BIT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Squad", x => x.IdSquad);
                });

            migrationBuilder.CreateTable(
                name: "Usuario",
                columns: table => new
                {
                    IdUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "VARCHAR(50)", nullable: false),
                    SobreNome = table.Column<string>(type: "VARCHAR(50)", nullable: false),
                    EmailPessoal = table.Column<string>(type: "VARCHAR(100)", nullable: false),
                    EmailCorporativo = table.Column<string>(type: "VARCHAR(100)", nullable: false),
                    Senha = table.Column<string>(type: "TEXT", maxLength: 60, nullable: false),
                    IsActive = table.Column<bool>(type: "BIT", nullable: true),
                    CodigoRecSenha = table.Column<string>(type: "NCHAR(6)", nullable: true),
                    Role = table.Column<int>(type: "INT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuario", x => x.IdUsuario);
                });

            migrationBuilder.CreateTable(
                name: "Estagiario",
                columns: table => new
                {
                    IdEstagiario = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Matrícula = table.Column<string>(type: "VARCHAR(100)", nullable: true),
                    IsBolsista = table.Column<bool>(type: "BIT", nullable: false),
                    IdUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdSquad = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdExpediente = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estagiario", x => x.IdEstagiario);
                    table.ForeignKey(
                        name: "FK_Estagiario_Expediente_IdExpediente",
                        column: x => x.IdExpediente,
                        principalTable: "Expediente",
                        principalColumn: "IdExpediente",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Estagiario_Squad_IdSquad",
                        column: x => x.IdSquad,
                        principalTable: "Squad",
                        principalColumn: "IdSquad");
                    table.ForeignKey(
                        name: "FK_Estagiario_Usuario_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuario",
                        principalColumn: "IdUsuario");
                });

            migrationBuilder.CreateTable(
                name: "SquadGestor",
                columns: table => new
                {
                    IdSquadGestor = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdUsuario = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdSquad = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SquadGestor", x => x.IdSquadGestor);
                    table.ForeignKey(
                        name: "FK_SquadGestor_Squad_IdSquad",
                        column: x => x.IdSquad,
                        principalTable: "Squad",
                        principalColumn: "IdSquad");
                    table.ForeignKey(
                        name: "FK_SquadGestor_Usuario_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuario",
                        principalColumn: "IdUsuario");
                });

            migrationBuilder.CreateTable(
                name: "Presenca",
                columns: table => new
                {
                    IdPresenca = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HorarioEntrada = table.Column<TimeOnly>(type: "TIME", nullable: true),
                    HorarioSaida = table.Column<TimeOnly>(type: "TIME", nullable: true),
                    IdEstagiario = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdCalendarioLetivo = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Presenca", x => x.IdPresenca);
                    table.ForeignKey(
                        name: "FK_Presenca_CalendarioLetivo_IdCalendarioLetivo",
                        column: x => x.IdCalendarioLetivo,
                        principalTable: "CalendarioLetivo",
                        principalColumn: "IdCalendarioLetivo");
                    table.ForeignKey(
                        name: "FK_Presenca_Estagiario_IdEstagiario",
                        column: x => x.IdEstagiario,
                        principalTable: "Estagiario",
                        principalColumn: "IdEstagiario");
                });

            migrationBuilder.CreateTable(
                name: "Tarefa",
                columns: table => new
                {
                    IdTarefa = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Titulo = table.Column<string>(type: "VARCHAR(100)", nullable: true),
                    Descricao = table.Column<string>(type: "TEXT", nullable: true),
                    DescricaoCorrecao = table.Column<string>(type: "TEXT", nullable: true),
                    Prazo = table.Column<DateTime>(type: "DATE", nullable: false),
                    Dificuldade = table.Column<int>(type: "INT", nullable: false),
                    StatusCorrecao = table.Column<int>(type: "INT", nullable: false),
                    IdEstagiario = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tarefa", x => x.IdTarefa);
                    table.ForeignKey(
                        name: "FK_Tarefa_Estagiario_IdEstagiario",
                        column: x => x.IdEstagiario,
                        principalTable: "Estagiario",
                        principalColumn: "IdEstagiario");
                });

            migrationBuilder.CreateTable(
                name: "JustificativaFalta",
                columns: table => new
                {
                    IdJustificativaFalta = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StatusValidacao = table.Column<int>(type: "INT", nullable: false),
                    MotivoRejeicao = table.Column<string>(type: "TEXT", nullable: true),
                    ValidadoPorIA = table.Column<bool>(type: "BIT", nullable: false),
                    IdPresenca = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdMidia = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JustificativaFalta", x => x.IdJustificativaFalta);
                    table.ForeignKey(
                        name: "FK_JustificativaFalta_Midia_IdMidia",
                        column: x => x.IdMidia,
                        principalTable: "Midia",
                        principalColumn: "IdMidia");
                    table.ForeignKey(
                        name: "FK_JustificativaFalta_Presenca_IdPresenca",
                        column: x => x.IdPresenca,
                        principalTable: "Presenca",
                        principalColumn: "IdPresenca");
                });

            migrationBuilder.CreateTable(
                name: "TarefaEstagiarioMidia",
                columns: table => new
                {
                    IdTarefaEstagiarioMidia = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdMidia = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdTarefa = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TarefaEstagiarioMidia", x => x.IdTarefaEstagiarioMidia);
                    table.ForeignKey(
                        name: "FK_TarefaEstagiarioMidia_Midia_IdMidia",
                        column: x => x.IdMidia,
                        principalTable: "Midia",
                        principalColumn: "IdMidia");
                    table.ForeignKey(
                        name: "FK_TarefaEstagiarioMidia_Tarefa_IdTarefa",
                        column: x => x.IdTarefa,
                        principalTable: "Tarefa",
                        principalColumn: "IdTarefa");
                });

            migrationBuilder.CreateTable(
                name: "TarefaMidia",
                columns: table => new
                {
                    IdTarefaMidia = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdMidia = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdTarefa = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TarefaMidia", x => x.IdTarefaMidia);
                    table.ForeignKey(
                        name: "FK_TarefaMidia_Midia_IdMidia",
                        column: x => x.IdMidia,
                        principalTable: "Midia",
                        principalColumn: "IdMidia");
                    table.ForeignKey(
                        name: "FK_TarefaMidia_Tarefa_IdTarefa",
                        column: x => x.IdTarefa,
                        principalTable: "Tarefa",
                        principalColumn: "IdTarefa");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CalendarioLetivo_Data",
                table: "CalendarioLetivo",
                column: "Data",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Estagiario_IdExpediente",
                table: "Estagiario",
                column: "IdExpediente");

            migrationBuilder.CreateIndex(
                name: "IX_Estagiario_IdSquad",
                table: "Estagiario",
                column: "IdSquad");

            migrationBuilder.CreateIndex(
                name: "IX_Estagiario_IdUsuario",
                table: "Estagiario",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Estagiario_Matrícula",
                table: "Estagiario",
                column: "Matrícula",
                unique: true,
                filter: "[Matrícula] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_JustificativaFalta_IdMidia",
                table: "JustificativaFalta",
                column: "IdMidia");

            migrationBuilder.CreateIndex(
                name: "IX_JustificativaFalta_IdPresenca",
                table: "JustificativaFalta",
                column: "IdPresenca");

            migrationBuilder.CreateIndex(
                name: "IX_JustificativaFalta_StatusValidacao",
                table: "JustificativaFalta",
                column: "StatusValidacao",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Presenca_IdCalendarioLetivo",
                table: "Presenca",
                column: "IdCalendarioLetivo");

            migrationBuilder.CreateIndex(
                name: "IX_Presenca_IdEstagiario",
                table: "Presenca",
                column: "IdEstagiario");

            migrationBuilder.CreateIndex(
                name: "IX_SquadGestor_IdSquad",
                table: "SquadGestor",
                column: "IdSquad");

            migrationBuilder.CreateIndex(
                name: "IX_SquadGestor_IdUsuario",
                table: "SquadGestor",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Tarefa_IdEstagiario",
                table: "Tarefa",
                column: "IdEstagiario");

            migrationBuilder.CreateIndex(
                name: "IX_TarefaEstagiarioMidia_IdMidia",
                table: "TarefaEstagiarioMidia",
                column: "IdMidia");

            migrationBuilder.CreateIndex(
                name: "IX_TarefaEstagiarioMidia_IdTarefa",
                table: "TarefaEstagiarioMidia",
                column: "IdTarefa");

            migrationBuilder.CreateIndex(
                name: "IX_TarefaMidia_IdMidia",
                table: "TarefaMidia",
                column: "IdMidia");

            migrationBuilder.CreateIndex(
                name: "IX_TarefaMidia_IdTarefa",
                table: "TarefaMidia",
                column: "IdTarefa");

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_EmailCorporativo_EmailPessoal",
                table: "Usuario",
                columns: new[] { "EmailCorporativo", "EmailPessoal" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JustificativaFalta");

            migrationBuilder.DropTable(
                name: "SquadGestor");

            migrationBuilder.DropTable(
                name: "TarefaEstagiarioMidia");

            migrationBuilder.DropTable(
                name: "TarefaMidia");

            migrationBuilder.DropTable(
                name: "Presenca");

            migrationBuilder.DropTable(
                name: "Midia");

            migrationBuilder.DropTable(
                name: "Tarefa");

            migrationBuilder.DropTable(
                name: "CalendarioLetivo");

            migrationBuilder.DropTable(
                name: "Estagiario");

            migrationBuilder.DropTable(
                name: "Expediente");

            migrationBuilder.DropTable(
                name: "Squad");

            migrationBuilder.DropTable(
                name: "Usuario");
        }
    }
}
