import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import useVote from "../../hooks/useVote";

const VoteButtons = ({
  complaintId,
  upvoteCount = 0,
  downvoteCount = 0,
  netVotes = 0,
  userVote: initialUserVote = null,
}) => {
  const { votes, userVote, handleVote, loading } = useVote({
    complaintId,
    initialUpvotes: upvoteCount,
    initialDownvotes: downvoteCount,
    initialNetVotes: netVotes,
    initialUserVote,
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`
        flex flex-col items-center bg-white rounded-xl border border-gray-200 shadow
        px-3 py-2 min-w-16.5 
      `}
      >
        {/* Upvote Button */}
        <button
          className={`
            rounded-full p-1 transition-colors
            ${userVote === "upvote" ? "bg-green-50 text-green-600" : "text-gray-400 hover:bg-gray-100"}
            focus:outline-none focus-visible:ring-2 focus-visible:ring-green-200
          `}
          onClick={() => handleVote("upvote")}
          aria-label="Upvote"
          disabled={loading}
        >
          <MdKeyboardArrowUp className="w-5 h-5" />
        </button>
        {/* Upvotes count */}
        <span className="text-xs text-green-600 font-semibold mb-1 mt-1">
          {votes.upvoteCount}
        </span>

        {/* Net votes */}
        <span
          className={`
          text-xl font-semibold mb-1
          ${
            userVote === "upvote"
              ? "text-green-700"
              : userVote === "downvote"
                ? "text-red-700"
                : "text-gray-900"
          }
        `}
        >
          {votes.netVotes}
        </span>
        {/* Downvotes count */}
        <span className="text-xs text-red-500 font-semibold mb-1">
          {votes.downvoteCount}
        </span>
        {/* Downvote Button */}
        <button
          className={`
            rounded-full p-1 transition-colors
            ${userVote === "downvote" ? "bg-red-50 text-red-600" : "text-gray-400 hover:bg-gray-100"}
            focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200
          `}
          onClick={() => handleVote("downvote")}
          aria-label="Downvote"
          disabled={loading}
        >
          <MdKeyboardArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default VoteButtons;
