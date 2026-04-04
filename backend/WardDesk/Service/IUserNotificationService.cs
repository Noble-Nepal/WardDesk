using System.Threading.Tasks;

namespace WardDesk.Service.Notifications
{
    public interface IUserNotificationService
    {
        Task SendAccountStatusChangedEmailAsync(string email, string fullName, bool isActive, string? reason);
        Task SendRegistrationRejectedEmailAsync(string email, string fullName, string? reason);
        Task SendVerificationApprovedEmailAsync(string email, string fullName);
        Task SendComplaintAssignedEmailAsync(
            string email,
            string technicianName,
            Guid complaintId,
            string complaintTitle,
            string? remarks);
    }
}