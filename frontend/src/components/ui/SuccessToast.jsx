const SuccessToast = ({ title, message }) => {
  return (
    <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 min-w-70 shadow-lg">
      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
        <svg
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div>
        <p className="text-green-800 font-semibold text-sm">{title}</p>
        <p className="text-green-600 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default SuccessToast;
