using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsicologiaIAAPI.Data;
using PsicologiaIAAPI.Models;
using System.Text;
using System.Text.Json;
using System.Net.Http.Headers;
using System.Text.Json.Serialization; 

namespace PsicologiaIAAPI.Controllers 
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public ChatController(ApplicationDbContext context, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _configuration = configuration;

            _httpClient = httpClientFactory.CreateClient("");
        }

        [HttpPost("{userId}/send")]
        public async Task<IActionResult> SendMessage(int userId, [FromBody] ChatRequest request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("Usuario no encontrado");

            string userMessage = request.UserMessage;
            if (string.IsNullOrEmpty(userMessage)) return BadRequest("El mensaje no puede estar vacío.");

            var userLog = new ChatLog { UserId = userId, Role = "user", Message = userMessage };
            _context.ChatLogs.Add(userLog);
            await _context.SaveChangesAsync();

            var dbHistory = await _context.ChatLogs
                .Where(c => c.UserId == user.Id)
                .OrderByDescending(c => c.Timestamp)
                .Take(10)
                .OrderBy(c => c.Timestamp)
                .ToListAsync();

            var messages = new List<object>();

            var systemInstruction = "Tu nombre es Escobar. Eres una psicóloga virtual empática. Escucha activamente, usa un tono cálido, no des diagnósticos médicos y si notas crisis graves, da líneas de ayuda.";
            messages.Add(new { role = "system", content = systemInstruction });

            foreach (var log in dbHistory)
            {
                string apiRole = log.Role == "model" ? "assistant" : "user";
                messages.Add(new { role = apiRole, content = log.Message });
            }

            string token = _configuration["HuggingFaceToken"] ?? throw new ArgumentNullException("Token faltante");

            string url = "https://router.huggingface.co/v1/chat/completions";

            var requestBody = new
            {
                messages = messages,
                model = "meta-llama/Meta-Llama-3-8B-Instruct",
                max_tokens = 200,
                temperature = 0.7
            };

            var jsonRequest = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.PostAsync(url, content);
            if (!response.IsSuccessStatusCode)
            {
                var errorResponseBody = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, $"Error de Hugging Face: {errorResponseBody}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);

            string aiResponse = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "No pude procesar la respuesta.";

            var aiLog = new ChatLog { UserId = userId, Role = "model", Message = aiResponse };
            _context.ChatLogs.Add(aiLog);
            await _context.SaveChangesAsync();

            return Ok(new { response = aiResponse });
        }
    }

    public class ChatRequest
    {
        [JsonPropertyName("userMessage")]
        public string UserMessage { get; set; } = string.Empty;
        public string Message { get; set; }
    }
}