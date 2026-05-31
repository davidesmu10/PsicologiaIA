using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsicologiaIA.Controllers;
using PsicologiaIAAPI.Data;
using PsicologiaIAAPI.Models;
using System;
using System.Threading.Tasks;
using Xunit;

namespace PsicologiaIPruebasUnitarias
{
    public class UserControllerTests
    {
        // Método ayudante para generar una base de datos limpia por cada test
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task CreateUser_WhenEmailDoesNotExist_ReturnsOkAndCreatesUser()
        {
            // 1. Arrange
            using var context = GetInMemoryDbContext();
            var controller = new UserController(context);
            var newUser = new User
            {
                FullName = "Alejandro Escobar",
                Email = "david@test.com"
            };

            // 2. Act
            var result = await controller.CreateUser(newUser);

            // 3. Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);

            // Verificar que sí se guardó en la base de datos
            var userInDb = await context.Users.FirstOrDefaultAsync(u => u.Email == "david@test.com");
            Assert.NotNull(userInDb);
            Assert.True((DateTime.UtcNow - userInDb.CreatedAt).TotalSeconds < 5); // Verifica que asignó la fecha actual
        }

        [Fact]
        public async Task CreateUser_WhenEmailAlreadyExists_ReturnsBadRequest()
        {
            // 1. Arrange
            using var context = GetInMemoryDbContext();

            // Insertamos un usuario previo con el mismo correo
            context.Users.Add(new User { Id = 1, FullName = "Usuario Existente", Email = "duplicado@test.com" });
            await context.SaveChangesAsync();

            var controller = new UserController(context);
            var duplicateUser = new User
            {
                FullName = "Otro Nombre",
                Email = "duplicado@test.com"
            };

            // 2. Act
            var result = await controller.CreateUser(duplicateUser);

            // 3. Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("El correo electrónico ya está registrado.", badRequestResult.Value);
        }

        [Fact]
        public async Task CreatePsychologist_WithValidData_ReturnsOkResult()
        {
            // 1. Arrange
            using var context = GetInMemoryDbContext();
            var controller = new UserController(context);
            var psychologist = new Psychologist
            {
                FullName = "Dra. Adriana Morales",
                IsAvailableForImmediate = true
            };

            // 2. Act
            var result = await controller.CreatePsychologist(psychologist);

            // 3. Assert
            var okResult = Assert.IsType<OkObjectResult>(result);

            var psychoInDb = await context.Psychologists.FirstOrDefaultAsync();
            Assert.NotNull(psychoInDb);
            Assert.Equal("Dra. Adriana Morales", psychoInDb.FullName);
        }

        [Fact]
        public async Task ToggleAvailability_WhenPsychologistExists_UpdatesValueAndReturnsOk()
        {
            // 1. Arrange
            using var context = GetInMemoryDbContext();
            var psychoId = 5;

            // Creamos el psicólogo inicialmente No disponible (false)
            context.Psychologists.Add(new Psychologist
            {
                Id = psychoId,
                FullName = "Dr. Ramiro",
                IsAvailableForImmediate = false
            });
            await context.SaveChangesAsync();

            var controller = new UserController(context);

            // 2. Act -> Lo cambiamos a Disponible (true)
            var result = await controller.ToggleAvailability(psychoId, true);

            // 3. Assert
            var okResult = Assert.IsType<OkObjectResult>(result);

            // Refrescamos el contexto para verificar el cambio real en base de datos
            var psychoInDb = await context.Psychologists.FindAsync(psychoId);
            Assert.True(psychoInDb.IsAvailableForImmediate);
        }

        [Fact]
        public async Task ToggleAvailability_WhenPsychologistDoesNotExist_ReturnsNotFound()
        {
            // 1. Arrange
            using var context = GetInMemoryDbContext();
            var controller = new UserController(context);

            // 2. Act -> Buscamos un ID que no existe (la DB está vacía)
            var result = await controller.ToggleAvailability(999, true);

            // 3. Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Psicólogo no encontrado", notFoundResult.Value);
        }
    }
}