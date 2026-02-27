using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WardDesk.DTO;
using WardDesk.Service;

namespace WardDesk.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ComplaintController : ControllerBase
    {
        private readonly ComplaintService _complaintService;

        public ComplaintController(ComplaintService complaintService)
        {
            _complaintService = complaintService;
        }

    }
}