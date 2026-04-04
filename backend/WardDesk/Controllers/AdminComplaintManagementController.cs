using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Security.Claims;
using WardDesk.DTO;
using WardDesk.Service;

namespace WardDesk.Controllers
{
    [ApiController]
    [Route("api/admin/complaints-management")]
    [Authorize(Roles = "admin")]
    public class AdminComplaintManagementController : ControllerBase
    {
        private readonly AdminComplaintManagementService _service;

        public AdminComplaintManagementController(AdminComplaintManagementService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<AdminComplaintListItemDTO>>> GetComplaints([FromQuery] AdminComplaintFilterDTO filter)
        {
            var data = await _service.GetComplaintsAsync(filter);
            return Ok(data);
        }

        [HttpGet("{complaintId}")]
        public async Task<ActionResult<AdminComplaintDetailDTO>> GetComplaintDetail(Guid complaintId)
        {
            var complaint = await _service.GetComplaintDetailAsync(complaintId);
            if (complaint == null) return NotFound(new { message = "Complaint not found." });
            return Ok(complaint);
        }

        [HttpPut("{complaintId}/verify")]
        public async Task<IActionResult> VerifyComplaint(Guid complaintId)
        {
            var adminId = GetUserId();
            var ok = await _service.SetVerificationAsync(complaintId, adminId, true);
            if (!ok) return NotFound(new { message = "Complaint not found." });
            return Ok(new { message = "Complaint verified." });
        }

        [HttpPut("{complaintId}/unverify")]
        public async Task<IActionResult> UnverifyComplaint(Guid complaintId)
        {
            var adminId = GetUserId();
            var ok = await _service.SetVerificationAsync(complaintId, adminId, false);
            if (!ok) return NotFound(new { message = "Complaint not found." });
            return Ok(new { message = "Complaint unverified." });
        }

        [HttpPut("{complaintId}/category")]
        public async Task<IActionResult> UpdateCategory(Guid complaintId, [FromBody] AdminUpdateComplaintCategoryDTO dto)
        {
            try
            {
                var ok = await _service.UpdateCategoryAsync(complaintId, dto.CategoryId);
                if (!ok) return NotFound(new { message = "Complaint not found." });
                return Ok(new { message = "Complaint category updated." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{complaintId}/status")]
        public async Task<IActionResult> UpdateStatus(Guid complaintId, [FromBody] AdminUpdateComplaintStatusByNameDTO dto)
        {
            try
            {
                var ok = await _service.UpdateStatusByNameAsync(complaintId, dto.StatusName);
                if (!ok) return NotFound(new { message = "Complaint not found." });
                return Ok(new { message = "Complaint status updated." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("report/pdf")]
        public async Task<IActionResult> DownloadPdfReport([FromQuery] AdminComplaintFilterDTO filter)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var data = await _service.GetComplaintsAsync(filter);

            var pdfBytes = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(20);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header()
                        .Text("WardDesk - Complaint Management Report")
                        .SemiBold().FontSize(16).FontColor(Colors.Blue.Darken2);

                    page.Content().Column(col =>
                    {
                        col.Item().Text($"Generated at: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC").FontSize(9);
                        col.Item().Text($"Total complaints: {data.Count}").FontSize(9);
                        col.Item().PaddingVertical(8).LineHorizontal(1);

                        foreach (var c in data)
                        {
                            col.Item().PaddingBottom(6).BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Column(item =>
                            {
                                item.Item().Text($"{c.TrackingId} - {c.Title}").SemiBold();
                                item.Item().Text($"Category: {c.CategoryName} | Status: {c.StatusName} | Verified: {(c.IsVerified ? "Yes" : "No")}");
                                item.Item().Text($"Citizen: {c.CitizenName} | Ward: {c.WardNumber}");
                                item.Item().Text($"Address: {c.LocationAddress ?? "N/A"}");
                                item.Item().Text($"Created: {c.CreatedAt:yyyy-MM-dd}");
                            });
                        }
                    });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Page ");
                            x.CurrentPageNumber();
                            x.Span(" / ");
                            x.TotalPages();
                        });
                });
            }).GeneratePdf();

            return File(pdfBytes, "application/pdf", $"complaints-report-{DateTime.UtcNow:yyyyMMddHHmmss}.pdf");
        }

        private Guid GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(claim))
                throw new UnauthorizedAccessException("Invalid token.");
            return Guid.Parse(claim);
        }
    }
}