import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-[#1a237e] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <span className="inline-block bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-full mb-8">
          Community-Driven Issue Tracking Platform
        </span>

        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl">
          Building Better Communities Together
        </h1>

        <p className="text-lg text-gray-300 mb-10 max-w-2xl">
          WardDesk empowers citizens, technicians, and administrators to
          collaborate effectively in reporting, tracking, and resolving
          community issues in real-time.
        </p>

        <div className="flex items-center gap-4">
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
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-lg border border-white/30 transition-colors duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
