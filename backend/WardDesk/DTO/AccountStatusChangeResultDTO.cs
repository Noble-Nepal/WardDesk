using System;

namespace WardDesk.DTO
{
    public class AccountStatusChangeResultDTO
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool OldIsActive { get; set; }
        public bool NewIsActive { get; set; }
    }
}