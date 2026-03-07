import { MdLocationOn, MdPerson, MdCalendarToday } from "react-icons/md";
import VoteButtons from "./VoteButtons";
import {
  getCategoryBadgeClass,
  getStatusBadgeClass,
  getStatusLabel,
} from "../../constants/dashboardConstants";

const ComplaintCard = ({ complaint, userVote = null, onViewDetails }) => {
  const photoUrl = complaint.photoUrls?.[0];

  const timeAgo = () => {
    const diff = Date.now() - new Date(complaint.createdAt).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Voting */}
        <div className="order-2 sm:order-1 flex sm:flex-col items-center justify-center sm:justify-start">
          <VoteButtons
            complaintId={complaint.complaintId}
            upvoteCount={complaint.upvoteCount}
            downvoteCount={complaint.downvoteCount}
            netVotes={complaint.netVotes}
            userVote={userVote}
            direction="vertical"
          />
        </div>

        {/* Image — mobile only */}
        {photoUrl && (
          <div className="order-1 sm:hidden">
            <img
              src={photoUrl}
              alt={complaint.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="order-3 sm:order-2 flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span
              className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeClass(complaint.categoryName)}`}
            >
              {complaint.categoryName}
            </span>
            <span
              className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(complaint.statusName)}`}
            >
              {getStatusLabel(complaint.statusName)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl text-gray-900 font-medium mb-2 break-words">
            {complaint.title}
          </h3>

          {/* Description */}
          {complaint.description && (
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 line-clamp-2">
              {complaint.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4">
            {complaint.locationAddress && (
              <span className="flex items-center gap-1.5">
                <MdLocationOn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Ward {complaint.wardNumber}
                {complaint.locationAddress && `, ${complaint.locationAddress}`}
              </span>
            )}
            {complaint.citizenName && (
              <span className="flex items-center gap-1.5">
                <MdPerson className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Reported by {complaint.citizenName}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MdCalendarToday className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {timeAgo()}
            </span>
          </div>

          {/* View Details */}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(complaint)}
              className="w-full sm:w-auto px-4 py-2 border border-red-500 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              View Details
            </button>
          )}
        </div>

        {/* Image — desktop only */}
        {photoUrl && (
          <div className="order-4 sm:order-3 hidden sm:block flex-shrink-0">
            <img
              src={photoUrl}
              alt={complaint.title}
              className="w-32 lg:w-40 h-32 lg:h-40 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
