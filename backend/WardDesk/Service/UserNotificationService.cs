using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.Extensions.Options;
using WardDesk.DTO;

namespace WardDesk.Service.Notifications
{
    public class UserNotificationService : IUserNotificationService
    {
        private readonly EmailSettings _settings;

        public UserNotificationService(IOptions<EmailSettings> options)
        {
            _settings = options.Value;
        }
        public async Task SendVerificationApprovedEmailAsync(string email, string fullName)
        {
            var body = $@"
        <div style='font-family: Arial, sans-serif; line-height:1.5; color:#1f2937;'>
          <h2 style='color:#2B4AA0;'>WardDesk Verification Approved</h2>
          <p>Dear {System.Net.WebUtility.HtmlEncode(fullName)},</p>
          <p>Your technician account has been <strong>verified and activated</strong>.</p>
          <p>You can now log in and start receiving complaint assignments.</p>
          <p>Regards,<br/>WardDesk Team</p>
        </div>";

            await SendEmailAsync(email, "Your WardDesk technician account is verified", body);
        }
        public async Task SendComplaintAssignedEmailAsync(
            string email,
            string technicianName,
            Guid complaintId,
            string complaintTitle,
            string? remarks)
                {
                    var safeName = WebUtility.HtmlEncode(technicianName);
                    var safeTitle = WebUtility.HtmlEncode(complaintTitle);
                    var safeRemarks = string.IsNullOrWhiteSpace(remarks) ? "-" : WebUtility.HtmlEncode(remarks);

                    var body = $@"
                <div style='font-family: Arial, sans-serif; line-height:1.5; color:#1f2937;'>
                  <h2 style='color:#2B4AA0;'>New Complaint Assignment</h2>
                  <p>Dear {safeName},</p>
                  <p>A new complaint has been <strong>assigned</strong> to you.</p>
                  <p><strong>Complaint ID:</strong> {complaintId}</p>
                  <p><strong>Title:</strong> {safeTitle}</p>
                  <p><strong>Remarks:</strong> {safeRemarks}</p>
                  <p>Please log in to WardDesk and take the necessary action.</p>
                  <p>Regards,<br/>WardDesk Team</p>
                </div>";

                    await SendEmailAsync(email, $"New Complaint Assigned - {complaintId}", body);
        }
        public async Task SendAccountStatusChangedEmailAsync(string email, string fullName, bool isActive, string? reason)
        {
            var subject = isActive
                ? "Your WardDesk account has been activated"
                : "Your WardDesk account has been deactivated";

            var statusText = isActive ? "activated" : "deactivated";
            var reasonText = string.IsNullOrWhiteSpace(reason)
                ? ""
                : $"<p><strong>Reason:</strong> {WebUtility.HtmlEncode(reason)}</p>";

            var body = $@"
                <div style='font-family: Arial, sans-serif; line-height:1.5; color:#1f2937;'>
                  <h2 style='color:#2B4AA0;'>WardDesk Account Update</h2>
                  <p>Dear {WebUtility.HtmlEncode(fullName)},</p>
                  <p>Your account has been <strong>{statusText}</strong> by the administrator.</p>
                  {reasonText}
                  <p>If you have questions, please contact WardDesk support.</p>
                  <p>Regards,<br/>WardDesk Team</p>
                </div>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendRegistrationRejectedEmailAsync(string email, string fullName, string? reason)
        {
            var reasonText = string.IsNullOrWhiteSpace(reason)
                ? ""
                : $"<p><strong>Reason:</strong> {WebUtility.HtmlEncode(reason)}</p>";

            var body = $@"
                <div style='font-family: Arial, sans-serif; line-height:1.5; color:#1f2937;'>
                  <h2 style='color:#2B4AA0;'>WardDesk Registration Update</h2>
                  <p>Dear {WebUtility.HtmlEncode(fullName)},</p>
                  <p>We are sorry to inform you that your technician registration was <strong>rejected</strong>.</p>
                  {reasonText}
                  <p>You may register again with valid details, or contact support for clarification.</p>
                  <p>Regards,<br/>WardDesk Team</p>
                </div>";

            await SendEmailAsync(email, "Your WardDesk technician registration was rejected", body);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            if (string.IsNullOrWhiteSpace(_settings.SmtpHost) ||
                string.IsNullOrWhiteSpace(_settings.SmtpUsername) ||
                string.IsNullOrWhiteSpace(_settings.SmtpPassword) ||
                string.IsNullOrWhiteSpace(_settings.FromEmail))
            {
                throw new InvalidOperationException("Email settings are not configured properly.");
            }

            using var message = new MailMessage
            {
                From = new MailAddress(_settings.FromEmail, _settings.FromName, Encoding.UTF8),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            message.To.Add(toEmail);

            using var smtp = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
            {
                EnableSsl = _settings.UseSsl,
                Credentials = new NetworkCredential(_settings.SmtpUsername, _settings.SmtpPassword)
            };

            await smtp.SendMailAsync(message);
        }
    }
}