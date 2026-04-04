namespace WardDesk.DTO
{
    public class UploadWorkPhotoDTO
    {
        public string PhotoUrl { get; set; } = string.Empty;
        public string PhotoType { get; set; } = "work_update"; // work_update | resolution
    }
}