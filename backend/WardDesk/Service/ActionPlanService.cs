using System.Text;
using System.Text.Json;

namespace WardDesk.Service
{
    public class ActionPlanResult
    {
        public List<string> SafetyAdvice { get; set; } = new();
        public List<string> TemporaryMeasures { get; set; } = new();
    }

    public class ActionPlanService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public ActionPlanService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _apiKey = configuration["Gemini:ApiKey"]
                ?? throw new InvalidOperationException("Gemini:ApiKey is not configured in appsettings.json");
        }

        public async Task<ActionPlanResult> GenerateAsync(string category, string description)
        {
            var prompt = $$"""
                You are a civic safety assistant for Nepal. A citizen has reported a public issue.
                Category: {{category}}
                Description: {{description}}

                Respond ONLY with valid JSON in this exact format, no markdown, no extra text:
                {
                  "safetyAdvice": ["point 1", "point 2", "point 3"],
                  "temporaryMeasures": ["point 1", "point 2", "point 3"]
                }

                Keep each point under 15 words. Be practical and specific to the Nepal context.
                """;

            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={_apiKey}";

            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException($"Gemini API returned {response.StatusCode}.");

            var responseJson = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseJson);

            var rawText = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString() ?? "";

            // Extract the JSON object robustly — handles markdown fences,
            // leading/trailing prose, and any other wrapping Gemini adds
            var firstBrace = rawText.IndexOf('{');
            var lastBrace = rawText.LastIndexOf('}');
            if (firstBrace == -1 || lastBrace == -1 || lastBrace <= firstBrace)
                throw new InvalidOperationException("No JSON object found in Gemini response.");

            var text = rawText[firstBrace..(lastBrace + 1)];

            using var planDoc = JsonDocument.Parse(text);

            var safetyAdvice = planDoc.RootElement
                .GetProperty("safetyAdvice")
                .EnumerateArray()
                .Select(e => e.GetString() ?? "")
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .ToList();

            var temporaryMeasures = planDoc.RootElement
                .GetProperty("temporaryMeasures")
                .EnumerateArray()
                .Select(e => e.GetString() ?? "")
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .ToList();

            return new ActionPlanResult
            {
                SafetyAdvice = safetyAdvice,
                TemporaryMeasures = temporaryMeasures,
            };
        }
    }
}
