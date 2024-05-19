using Microsoft.EntityFrameworkCore;
using PlayerPages;
using PlayerPages.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddMvc();
builder.Services.AddControllers(options => options.EnableEndpointRouting = false);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSassCompiler();

builder.Services.AddDbContext<PlayerPagesDbContext>(options => options.UseInMemoryDatabase("PlayerPages1"));

builder.Services.AddSingleton<IContentDeliveryNetwork, Standin>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.MapGet("/", () =>
{
    return Results.Redirect("/public/example1");
});

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.UseMvc();

app.Run();

class Standin : IContentDeliveryNetwork
{
    public string? GetPagePath(string playerPagesPageId) =>
        //$"https://localhost:7175/{Uri.EscapeDataString(playerPagesPageId)}";
        null;

    public Task InvalidateCacheAsync(string playerPagesPageId)
    {
        System.Diagnostics.Debug.WriteLine($"This is where we would ask the CDN to invalidate its cache for {GetPagePath(playerPagesPageId)}");
        return Task.CompletedTask;
    }
}