const steps = [
  {
    number: "1",
    title: "Report an Issue",
    description: "Take a photo, add location and describe the problem",
    color: "bg-red-500",
  },
  {
    number: "2",
    title: "Ward Verifies",
    description: "Admin reviews and assigns to appropriate technician",
    color: "bg-red-500",
  },
  {
    number: "3",
    title: "Work in Progress",
    description: "Technician reviews issue and updates status",
    color: "bg-red-500",
  },
  {
    number: "✓",
    title: "Issue Resolved",
    description: "Receive notification and view before/after photos",
    color: "bg-green-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-500">
            Four simple steps to make a difference
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-5"
            >
              <div
                className={`w-14 h-14 rounded-full ${step.color} text-white flex items-center justify-center shrink-0`}
              >
                <span className="text-xl font-bold">{step.number}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
