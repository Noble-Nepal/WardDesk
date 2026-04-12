import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
      {title}
    </h2>
    <div className="space-y-3 text-sm text-gray-600 leading-relaxed">{children}</div>
  </section>
);

const Li = ({ children }) => (
  <li className="flex gap-2">
    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2B4AA0] shrink-0" />
    <span>{children}</span>
  </li>
);

const DataCard = ({ label, items }) => (
  <div className="bg-gray-50 rounded-xl p-4 mt-3">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
    <ul className="space-y-1.5">
      {items.map((item, i) => <Li key={i}>{item}</Li>)}
    </ul>
  </div>
);

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link
            to="/register"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#2B4AA0] rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-none">Privacy Policy</h1>
              <p className="text-xs text-gray-400 mt-0.5">Last updated: April 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 sm:px-10 py-8">

          {/* Intro banner */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-8 flex gap-3">
            <div className="w-1 rounded-full bg-emerald-500 shrink-0" />
            <p className="text-sm text-emerald-700">
              Your privacy matters to us. WardDesk collects only the data necessary to operate
              the platform and deliver civic services. We do not sell your personal information.
            </p>
          </div>

          <Section title="1. Introduction">
            <p>
              WardDesk (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;the platform&rdquo;) is committed to protecting the personal
              information of its users. This Privacy Policy explains what data we collect, how we
              use it, and your rights regarding that data.
            </p>
            <p>
              This policy applies to all users of the WardDesk platform, including citizens,
              technicians, and administrators operating within Nepal.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect the following categories of personal data:</p>

            <DataCard
              label="Account Registration Data"
              items={[
                "Full name",
                "Email address",
                "Phone number",
                "Residential address and ward number",
                "Account type (Citizen or Technician)",
                "Citizenship document photo (Technician accounts only)",
                "Profile photo (optional)",
              ]}
            />

            <DataCard
              label="Complaint Submission Data"
              items={[
                "Complaint title and description",
                "Category and priority level",
                "Location address and GPS coordinates (latitude/longitude)",
                "Photos attached to complaints",
                "Submission date and time",
                "Tracking ID",
              ]}
            />

            <DataCard
              label="Activity Data"
              items={[
                "Voting activity (upvotes and downvotes on complaints)",
                "Complaint status updates and remarks (Technicians)",
                "Work progress and resolution photos (Technicians)",
                "Login timestamps and session information",
              ]}
            />
          </Section>

          <Section title="3. How We Use Your Information">
            <p>Your personal information is used to:</p>
            <ul className="space-y-2 mt-2">
              <Li>Create and manage your WardDesk account.</Li>
              <Li>Process and route complaints to the relevant ward office and technicians.</Li>
              <Li>Send email notifications about complaint status updates and resolution.</Li>
              <Li>Enable ward administrators to verify technician credentials.</Li>
              <Li>Display complaint information (title, category, location, photos) to other citizens on the public dashboard.</Li>
              <Li>Generate analytics and reports for ward management and civic planning.</Li>
              <Li>Maintain the security and integrity of the platform.</Li>
            </ul>
          </Section>

          <Section title="4. Public Visibility of Complaint Data">
            <p>
              When you submit a complaint, certain fields are displayed publicly on the WardDesk
              Complaint Dashboard to allow community engagement and voting:
            </p>
            <ul className="space-y-2 mt-2 mb-3">
              <Li>Complaint title, description, and category</Li>
              <Li>Location address and ward number</Li>
              <Li>Complaint photos (before and after resolution)</Li>
              <Li>Current status and vote count</Li>
              <Li>Your name (as the complaint reporter)</Li>
            </ul>
            <p>
              By submitting a complaint, you consent to this information being visible to other
              registered and unregistered users of the platform. If you have concerns about a
              specific complaint, contact the ward office to request removal.
            </p>
          </Section>

          <Section title="5. Data Sharing">
            <p>We share your data only in the following limited circumstances:</p>
            <ul className="space-y-2 mt-2">
              <Li>
                <strong>Ward Administrators:</strong> Can view all complaint details, user
                profiles, and technician credentials within their jurisdiction.
              </Li>
              <Li>
                <strong>Assigned Technicians:</strong> Can view the complaint details, location,
                citizen name, and contact information relevant to complaints assigned to them.
              </Li>
              <Li>
                <strong>Other Citizens:</strong> Can view publicly displayed complaint information
                as described in Section 4.
              </Li>
              <Li>
                <strong>Legal Requirements:</strong> We may disclose data if required by Nepalese
                law or by a valid court order.
              </Li>
            </ul>
            <p className="mt-3">
              We do not sell, rent, or trade your personal information to third parties for
              marketing or commercial purposes.
            </p>
          </Section>

          <Section title="6. Photo Storage">
            <p>
              Photos uploaded on WardDesk (including complaint photos, resolution work photos,
              and citizenship documents) are stored securely via a third-party cloud storage
              provider (Cloudinary). These photos are:
            </p>
            <ul className="space-y-2 mt-2">
              <Li>Stored with access controls appropriate to their sensitivity.</Li>
              <Li>Citizenship photos are accessible only to ward administrators for verification.</Li>
              <Li>Complaint and work photos are accessible as described in the public visibility section above.</Li>
            </ul>
          </Section>

          <Section title="7. Data Retention">
            <p>
              We retain your personal data for as long as your account is active. If you request
              account deletion, your personal data will be removed from active systems within 30
              days, except where retention is required by law or for resolving ongoing disputes.
            </p>
            <p>
              Complaint records may be retained for civic record-keeping purposes even after
              account deletion, in an anonymized or aggregated form.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <p>As a WardDesk user, you have the right to:</p>
            <ul className="space-y-2 mt-2">
              <Li><strong>Access:</strong> Request a copy of the personal data we hold about you.</Li>
              <Li><strong>Correction:</strong> Update your profile information at any time through Account Settings.</Li>
              <Li><strong>Deletion:</strong> Request deletion of your account and personal data.</Li>
              <Li><strong>Objection:</strong> Object to specific uses of your data where applicable.</Li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <span className="text-[#2B4AA0] font-medium">warddesk1notifications@gmail.com</span>.
            </p>
          </Section>

          <Section title="9. Security">
            <p>
              WardDesk implements appropriate technical and organizational measures to protect
              your personal data from unauthorized access, alteration, disclosure, or destruction.
              These include:
            </p>
            <ul className="space-y-2 mt-2">
              <Li>Password hashing and secure authentication (JWT-based sessions).</Li>
              <Li>HTTPS encryption for all data in transit.</Li>
              <Li>Role-based access control so users only access data relevant to their role.</Li>
              <Li>Firebase authentication for identity management.</Li>
            </ul>
            <p className="mt-3">
              Despite these measures, no system can guarantee absolute security. You are responsible
              for keeping your password confidential and for any activity under your account.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy periodically. When we make significant changes,
              we will notify users through the platform or by email. Your continued use of
              WardDesk after changes are posted constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              For privacy-related questions, data access requests, or concerns:
            </p>
            <div className="mt-3 bg-gray-50 rounded-xl p-4 text-sm space-y-1">
              <p><span className="font-medium text-gray-700">Platform:</span> WardDesk Civic Management System</p>
              <p><span className="font-medium text-gray-700">Email:</span> <span className="text-[#2B4AA0]">warddesk1notifications@gmail.com</span></p>
              <p><span className="font-medium text-gray-700">Jurisdiction:</span> Nepal</p>
            </div>
          </Section>

        </div>

        <div className="text-center mt-6">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-sm text-[#2B4AA0] hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration
          </Link>
        </div>
      </div>
    </div>
  );
}
