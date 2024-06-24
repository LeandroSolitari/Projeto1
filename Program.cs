using Microsoft.EntityFrameworkCore;
using CustomerManagement.Models;



var builder = WebApplication.CreateBuilder(args);


// Configurar DbContext e outros servi�os
builder.Services.AddDbContext<CustomerContext>(options =>
options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));



// Adicionar servi�os ao cont�iner.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();





// Configurar o DbContext para usar SQLite
builder.Services.AddDbContext<CustomerContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configurar o pipeline de solicita��o HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Number Decomposition API V1");
        c.RoutePrefix = string.Empty;  // Acessar o Swagger na raiz
    });
}

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
