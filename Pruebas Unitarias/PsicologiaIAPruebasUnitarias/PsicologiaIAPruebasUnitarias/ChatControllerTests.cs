using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Moq.Protected;
using PsicologiaIAAPI.Controllers;
using PsicologiaIAAPI.Data;
using PsicologiaIAAPI.Models;
using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace PsicologiaIPruebasUnitarias
{
    public class ChatControllerTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task SendMessage_WithValidRequest_ReturnsOkResult()
        {
            // 1. Arrange
            var userId = 1;
            using var context = GetInMemoryDbContext();

            context.Users.Add(new User { Id = userId, FullName = "David Test", Email = "david@test.com" });
            await context.SaveChangesAsync();

            var request = new ChatRequest
            {
                UserMessage = "Hola, me siento abrumado"
            };

            var mockConfiguration = new Mock<IConfiguration>();
            mockConfiguration.Setup(c => c[It.IsAny<string>()]).Returns("Mocked_HuggingFace_Token");

            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();
            var fakeApiResponse = "{\"choices\": [{\"message\": {\"content\": \"Entiendo cómo te sientes...\"}}]}";

            mockHttpMessageHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(fakeApiResponse, System.Text.Encoding.UTF8, "application/json")
                });

            var httpClient = new HttpClient(mockHttpMessageHandler.Object);
            var mockHttpClientFactory = new Mock<IHttpClientFactory>();
            mockHttpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            var controller = new ChatController(context, mockConfiguration.Object, mockHttpClientFactory.Object);

            // 2. Act
            var result = await controller.SendMessage(userId, request);

            // 3. Assert
            if (result is BadRequestObjectResult badRequest)
            {
                var errorDetail = badRequest.Value != null ? badRequest.Value.ToString() : "Sin detalle";
                Assert.Fail($"El test falló porque el controlador devolvió BadRequest (400). Detalle: {errorDetail}");
            }
            else if (result is ObjectResult objectResult && objectResult.StatusCode != 200)
            {
                Assert.Fail($"El controlador devolvió un código de error: {objectResult.StatusCode} - El valor fue: {objectResult.Value}");
            }

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public async Task SendMessage_WithEmptyMessage_ReturnsBadRequest(string invalidMessage)
        {
            // 1. Arrange
            var userId = 1;
            using var context = GetInMemoryDbContext();

            context.Users.Add(new User { Id = userId, FullName = "David Test", Email = "david@test.com" });
            await context.SaveChangesAsync();

            var mockConfiguration = new Mock<IConfiguration>();
            var mockHttpClientFactory = new Mock<IHttpClientFactory>();
            var httpClient = new HttpClient();
            mockHttpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            var controller = new ChatController(context, mockConfiguration.Object, mockHttpClientFactory.Object);

            var request = new ChatRequest
            {
                UserMessage = invalidMessage
            };

            // 2. Act
            var result = await controller.SendMessage(userId, request);

            // 3. Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}