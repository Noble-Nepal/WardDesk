const features = [
  {
    icon: (
      <svg
        width="24"
        height="24"
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
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    title: "Easy Reporting",
    description:
      "Report community issues instantly with photos, location, and detailed descriptions.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    title: "Real-time Tracking",
    description:
      "Track the progress of your reported issues from submission to resolution.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    title: "Community Engagement",
    description:
      "Connect with ward officials and technicians for faster issue resolution.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
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
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    title: "Secure & Reliable",
    description:
      "Built with security in mind to protect your data and ensure platform reliability.",
  },
];

const WhyChoose = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose WardDesk?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            A comprehensive platform designed to streamline community issue
            management
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.iconBg} ${feature.iconColor} flex items-center justify-center mb-5`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
