using System.Net;
using libraryapi;
using libraryapi.DatabaseContexts;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddDbContext<BooksContext>(dbContextOptions => {
    dbContextOptions.UseMySql("Server=localhost;port=23495;Database=libraryapi;User Id=libraryapi;Pwd=1234;Max Pool Size=150;", new MariaDbServerVersion(new Version(10, 10, 3)),
        mySqlOptions => {
            mySqlOptions.EnableStringComparisonTranslations();
        }
    );
});
builder.Services.Configure<ApiBehaviorOptions>(options => {
    options.InvalidModelStateResponseFactory = actionContext => {
        List<string> errors = actionContext.ModelState.Values
            .SelectMany(entry => entry.Errors)
            .Select(error => error.ErrorMessage)
            .ToList();
        actionContext.HttpContext.Response.ContentType = "application/json";

        return new BadRequestObjectResult(new ErrorsResponse(errors));
    };
});

WebApplication app = builder.Build();
app.UseExceptionHandler(errorApp => {
    errorApp.Run(async (HttpContext context) => {
        Exception? exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
    });
});
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

