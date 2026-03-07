using Microsoft.EntityFrameworkCore;
using WardDesk.Database;
using WardDesk.DTO;
using WardDesk.Models;

namespace WardDesk.Service
{
    public class VoteService
    {
        private readonly AppDbContext _context;

        public VoteService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<VoteResponseDTO> VoteAsync(Guid userId, VoteDTO request)
        {
            var voteType = request.VoteType.ToLower();
            if (voteType != "upvote" && voteType != "downvote")
                throw new InvalidOperationException("Vote type must be 'upvote' or 'downvote'.");

            var complaint = await _context.Complaints.FindAsync(request.ComplaintId);
            if (complaint == null)
                throw new InvalidOperationException("Complaint not found.");

            var existingVote = await _context.ComplaintVotes
                .FirstOrDefaultAsync(v => v.ComplaintId == request.ComplaintId && v.UserId == userId);

            if (existingVote != null)
            {
                if (existingVote.VoteType == voteType)
                {
                    _context.ComplaintVotes.Remove(existingVote);

                    if (voteType == "upvote")
                        complaint.UpvoteCount = Math.Max(0, complaint.UpvoteCount - 1);
                    else
                        complaint.DownvoteCount = Math.Max(0, complaint.DownvoteCount - 1);
                }
                else
                {
                    existingVote.VoteType = voteType;
                    existingVote.CreatedAt = DateTime.UtcNow;

                    if (voteType == "upvote")
                    {
                        complaint.UpvoteCount += 1;
                        complaint.DownvoteCount = Math.Max(0, complaint.DownvoteCount - 1);
                    }
                    else
                    {
                        complaint.DownvoteCount += 1;
                        complaint.UpvoteCount = Math.Max(0, complaint.UpvoteCount - 1);
                    }
                }
            }
            else
            {
                _context.ComplaintVotes.Add(new ComplaintVote
                {
                    VoteId = Guid.NewGuid(),
                    ComplaintId = request.ComplaintId,
                    UserId = userId,
                    VoteType = voteType,
                    CreatedAt = DateTime.UtcNow,
                });

                if (voteType == "upvote")
                    complaint.UpvoteCount += 1;
                else
                    complaint.DownvoteCount += 1;
            }

            complaint.NetVotes = complaint.UpvoteCount - complaint.DownvoteCount;
            complaint.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var userVote = await _context.ComplaintVotes
                .FirstOrDefaultAsync(v => v.ComplaintId == request.ComplaintId && v.UserId == userId);

            return new VoteResponseDTO
            {
                UpvoteCount = complaint.UpvoteCount,
                DownvoteCount = complaint.DownvoteCount,
                NetVotes = complaint.NetVotes,
                UserVote = userVote?.VoteType,
            };
        }

        public async Task<string?> GetUserVoteAsync(Guid userId, Guid complaintId)
        {
            var vote = await _context.ComplaintVotes
                .FirstOrDefaultAsync(v => v.ComplaintId == complaintId && v.UserId == userId);
            return vote?.VoteType;
        }
    }
}