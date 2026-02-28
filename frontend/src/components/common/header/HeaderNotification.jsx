import { HiOutlineBell } from "react-icons/hi";

const HeaderNotification = ({ hasUnread = true }) => {
  return (
    <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
      <HiOutlineBell className="w-5 h-5 text-gray-600" />

      {/* Red notification dot */}
      {hasUnread && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
};

export default HeaderNotification;
