using Microsoft.EntityFrameworkCore.Migrations;

namespace intuitive.Migrations
{
    public partial class SeedTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("IF EXISTS (SELECT 1 FROM Measures WITH (NOLOCK)) BEGIN UPDATE Measures SET Value = '30mm' WHERE Id = (SELECT TOP 1 Id FROM Measures WITH (NOLOCK)) END ELSE BEGIN INSERT INTO Measures (Value) VALUES ('30mm') END");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
