import { useState, useCallback } from "react";
import { voteOnComplaint } from "../api/complaintApi";

const useVote = ({
  complaintId,
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialNetVotes = 0,
  initialUserVote = null,
}) => {
  const [votes, setVotes] = useState({
    upvoteCount: initialUpvotes,
    downvoteCount: initialDownvotes,
    netVotes: initialNetVotes,
  });
  const [userVote, setUserVote] = useState(initialUserVote);
  const [loading, setLoading] = useState(false);

  const handleVote = useCallback(
    async (voteType) => {
      if (loading) return;
      setLoading(true);

      const prevVotes = { ...votes };
      const prevUserVote = userVote;

      // Optimistic update
      if (userVote === voteType) {
        setUserVote(null);
        setVotes((v) => ({
          upvoteCount:
            voteType === "upvote" ? v.upvoteCount - 1 : v.upvoteCount,
          downvoteCount:
            voteType === "downvote" ? v.downvoteCount - 1 : v.downvoteCount,
          netVotes: voteType === "upvote" ? v.netVotes - 1 : v.netVotes + 1,
        }));
      } else if (userVote) {
        setUserVote(voteType);
        setVotes((v) => ({
          upvoteCount:
            voteType === "upvote" ? v.upvoteCount + 1 : v.upvoteCount - 1,
          downvoteCount:
            voteType === "downvote" ? v.downvoteCount + 1 : v.downvoteCount - 1,
          netVotes: voteType === "upvote" ? v.netVotes + 2 : v.netVotes - 2,
        }));
      } else {
        setUserVote(voteType);
        setVotes((v) => ({
          upvoteCount:
            voteType === "upvote" ? v.upvoteCount + 1 : v.upvoteCount,
          downvoteCount:
            voteType === "downvote" ? v.downvoteCount + 1 : v.downvoteCount,
          netVotes: voteType === "upvote" ? v.netVotes + 1 : v.netVotes - 1,
        }));
      }

      try {
        const res = await voteOnComplaint(complaintId, voteType);
        setVotes({
          upvoteCount: res.data.upvoteCount,
          downvoteCount: res.data.downvoteCount,
          netVotes: res.data.netVotes,
        });
        setUserVote(res.data.userVote);
      } catch {
        setVotes(prevVotes);
        setUserVote(prevUserVote);
      } finally {
        setLoading(false);
      }
    },
    [complaintId, votes, userVote, loading],
  );

  return { votes, userVote, handleVote, loading };
};

export default useVote;
