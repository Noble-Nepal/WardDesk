import { Link } from "react-router-dom";

const CTABanner = () => {
  return (
    <section className="bg-[#1a237e] py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-300 mb-10">
          Join WardDesk today and be part of building better communities
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-7 py-3.5 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            Create Account
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
          <Link
            to="/login"
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold px-7 py-3.5 rounded-lg transition-colors duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
