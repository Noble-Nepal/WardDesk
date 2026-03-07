import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import useVote from "../../hooks/useVote";

const VoteButtons = ({
  complaintId,
  upvoteCount = 0,
  downvoteCount = 0,
  netVotes = 0,
  userVote: initialUserVote = null,
  direction = "vertical",
}) => {
  const { votes, userVote, handleVote, loading } = useVote({
    complaintId,
    initialUpvotes: upvoteCount,
    initialDownvotes: downvoteCount,
    initialNetVotes: netVotes,
    initialUserVote,
  });

  const isVertical = direction === "vertical";

  return (
    <div
      className={`flex items-center gap-1 ${
        isVertical ? "flex-col" : "flex-row"
      }`}
    >
      <button
        onClick={() => handleVote("upvote")}
        disabled={loading}
        className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
          userVote === "upvote"
            ? "text-green-600 bg-green-50"
            : "text-gray-400 hover:bg-gray-100"
        }`}
        title="Upvote"
      >
        <MdKeyboardArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <span
        className={`text-xl sm:text-2xl font-semibold ${
          userVote === "upvote"
            ? "text-green-600"
            : userVote === "downvote"
              ? "text-red-600"
              : "text-gray-900"
        }`}
      >
        {votes.netVotes}
      </span>

      <button
        onClick={() => handleVote("downvote")}
        disabled={loading}
        className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
          userVote === "downvote"
            ? "text-red-600 bg-red-50"
            : "text-gray-400 hover:bg-gray-100"
        }`}
        title="Downvote"
      >
        <MdKeyboardArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

export default VoteButtons;
