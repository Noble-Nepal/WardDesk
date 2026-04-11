namespace WardDesk.DTO
{
    public class WardAreaDTO
    {
        public int WardAreaId { get; set; }
        public string AddressName { get; set; } = string.Empty;
        public int WardFrom { get; set; }
        public int WardTo { get; set; }
    }

    public class CreateWardAreaDTO
    {
        public string AddressName { get; set; } = string.Empty;
        public int WardFrom { get; set; }
        public int WardTo { get; set; }
    }
}
