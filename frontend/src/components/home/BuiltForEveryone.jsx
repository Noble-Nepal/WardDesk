import { Link } from "react-router-dom";

const roles = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    iconBg: "bg-slate-800",
    title: "Citizens",
    perks: [
      "Report community issues instantly",
      "Track resolution progress",
      "Engage with community updates",
    ],
    buttonText: "Register as Citizen",
    buttonStyle: "bg-red-500 hover:bg-red-600 text-white",
    link: "/register",
    badge: null,
    borderStyle: "border-gray-200",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    iconBg: "bg-red-500",
    title: "Technicians",
    perks: [
      "Manage assigned tasks",
      "Update issue resolution status",
      "Access technician dashboard",
    ],
    buttonText: "Register as Technician",
    buttonStyle: "bg-red-500 hover:bg-red-600 text-white",
    link: "/register",
    badge: "Requires Verification",
    borderStyle: "border-red-400 border-dashed",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
    iconBg: "bg-slate-800",
    title: "Administrators",
    perks: [
      "Verify technician credentials",
      "Oversee all platform activities",
      "Manage system settings",
    ],
    buttonText: "Admin Login",
    buttonStyle:
      "bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-800",
    link: "/login",
    badge: null,
    borderStyle: "border-gray-200",
  },
];

const BuiltForEveryone = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built for Everyone
          </h2>
          <p className="text-gray-500">Different roles, unified platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roles.map((role, i) => (
            <div
              key={i}
              className={`relative border ${role.borderStyle} rounded-xl p-8 flex flex-col`}
            >
              {role.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {role.badge}
                </span>
              )}

              <div
                className={`w-14 h-14 rounded-full ${role.iconBg} text-white flex items-center justify-center mb-5`}
              >
                {role.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {role.title}
              </h3>

              <div className="flex flex-col gap-3 mb-8 flex-1">
                {role.perks.map((perk, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="text-green-500 shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">{perk}</span>
                  </div>
                ))}
              </div>

              <Link
                to={role.link}
                className={`w-full py-3 rounded-lg text-sm font-semibold text-center transition-colors duration-200 ${role.buttonStyle}`}
              >
                {role.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuiltForEveryone;
