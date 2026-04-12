import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

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

export default function TermsAndConditions() {
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
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-none">Terms and Conditions</h1>
              <p className="text-xs text-gray-400 mt-0.5">Last updated: April 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 sm:px-10 py-8">

          {/* Intro banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex gap-3">
            <div className="w-1 rounded-full bg-[#2B4AA0] shrink-0" />
            <p className="text-sm text-[#2B4AA0]">
              Please read these Terms and Conditions carefully before registering on WardDesk.
              By creating an account, you agree to be bound by these terms.
            </p>
          </div>

          <Section title="1. About WardDesk">
            <p>
              WardDesk is a civic complaint management platform designed to connect citizens with
              their local ward office. It allows residents to report public issues such as road
              damage, water supply problems, electrical faults, and sanitation concerns, and track
              their resolution in real time.
            </p>
            <p>
              WardDesk operates within the jurisdiction of the relevant municipal ward office and
              is intended solely for civic purposes within Nepal.
            </p>
          </Section>

          <Section title="2. Acceptance of Terms">
            <p>
              By registering on WardDesk as a Citizen or Technician, you confirm that:
            </p>
            <ul className="space-y-2 mt-2">
              <Li>You have read, understood, and agree to these Terms and Conditions.</Li>
              <Li>You have read and agree to our Privacy Policy.</Li>
              <Li>The information you provide during registration is accurate and truthful.</Li>
            </ul>
          </Section>

          <Section title="3. User Accounts">
            <p>
              WardDesk supports two types of user accounts:
            </p>
            <ul className="space-y-2 mt-2 mb-3">
              <Li>
                <strong>Citizen:</strong> Registered residents who can report community issues,
                vote on complaints, and track resolution progress.
              </Li>
              <Li>
                <strong>Technician:</strong> Field workers assigned by admins to resolve reported
                complaints. Technician accounts require citizenship document verification before activation.
              </Li>
            </ul>
            <p>
              You are responsible for maintaining the confidentiality of your password and for all
              activities that occur under your account. Notify us immediately at{" "}
              <span className="text-[#2B4AA0] font-medium">warddesk1notifications@gmail.com</span> if you
              suspect unauthorized access.
            </p>
          </Section>

          <Section title="4. Complaint Submission Rules">
            <p>
              When submitting a complaint, you agree that:
            </p>
            <ul className="space-y-2 mt-2">
              <Li>The complaint describes a genuine public issue in your ward area.</Li>
              <Li>All information provided (title, description, location, and photos) is accurate and not misleading.</Li>
              <Li>You will not submit duplicate, frivolous, or malicious complaints.</Li>
              <Li>Photos uploaded are relevant to the reported issue and do not contain inappropriate or offensive content.</Li>
              <Li>You will not use the complaint system to harass individuals or target specific persons.</Li>
            </ul>
            <p className="mt-3">
              WardDesk reserves the right to remove complaints that violate these rules and to
              suspend accounts that repeatedly misuse the reporting system.
            </p>
          </Section>

          <Section title="5. Technician Responsibilities">
            <p>
              Registered technicians must:
            </p>
            <ul className="space-y-2 mt-2">
              <Li>Only accept and work on complaints assigned to them by an admin.</Li>
              <Li>Upload accurate work-in-progress and resolution photos to document completed work.</Li>
              <Li>Update complaint status honestly. Marking a complaint as resolved before actual resolution is a violation of these terms.</Li>
              <Li>Maintain professional conduct when handling any citizen-reported issue.</Li>
            </ul>
          </Section>

          <Section title="6. Voting and Community Engagement">
            <p>
              Citizens may upvote or downvote complaints to indicate community priority. Voting
              must reflect genuine community concern. Coordinated vote manipulation, bot activity,
              or any form of artificial engagement is strictly prohibited and may result in
              account suspension.
            </p>
          </Section>

          <Section title="7. Prohibited Activities">
            <p>You must not:</p>
            <ul className="space-y-2 mt-2">
              <Li>Attempt to access another user's account or personal data.</Li>
              <Li>Upload malware, harmful scripts, or exploit the platform in any way.</Li>
              <Li>Use WardDesk for commercial advertising or spam.</Li>
              <Li>Impersonate a ward officer, technician, or any other person.</Li>
              <Li>Submit complaints about issues outside your registered ward unless otherwise permitted.</Li>
              <Li>Attempt to reverse-engineer or scrape data from the WardDesk platform.</Li>
            </ul>
          </Section>

          <Section title="8. Data and Photos">
            <p>
              By submitting photos to WardDesk, you grant the platform a non-exclusive,
              royalty-free license to store and display those photos for the purpose of civic
              complaint management and resolution tracking. Photos may be viewed by ward
              administrators and technicians relevant to the complaint.
            </p>
            <p>
              You must not upload images that contain personally identifiable information of
              individuals without their consent, or any content that is offensive, defamatory,
              or illegal under Nepalese law.
            </p>
          </Section>

          <Section title="9. Account Termination">
            <p>
              WardDesk administrators reserve the right to suspend or terminate any account that:
            </p>
            <ul className="space-y-2 mt-2">
              <Li>Violates these Terms and Conditions.</Li>
              <Li>Submits false or misleading complaints.</Li>
              <Li>Engages in any prohibited activity listed above.</Li>
              <Li>Remains inactive for an extended period.</Li>
            </ul>
            <p className="mt-3">
              You may request account deletion at any time by contacting the ward office or
              emailing support.
            </p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>
              WardDesk is a communication tool between citizens and ward offices. The platform
              does not guarantee a specific resolution time for any complaint. Response and
              resolution timelines depend on the ward office and technician availability.
            </p>
            <p>
              To the extent permitted by law, WardDesk and its operators shall not be liable for
              any indirect, incidental, or consequential damages arising from the use or inability
              to use the platform.
            </p>
          </Section>

          <Section title="11. Governing Law">
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws
              of Nepal. Any disputes arising from the use of WardDesk shall be subject to the
              jurisdiction of the competent courts in Nepal.
            </p>
          </Section>

          <Section title="12. Changes to These Terms">
            <p>
              WardDesk may update these Terms and Conditions from time to time. Any significant
              changes will be communicated through the platform. Your continued use of WardDesk
              after changes are posted constitutes your acceptance of the updated terms.
            </p>
          </Section>

          <Section title="13. Contact Us">
            <p>
              If you have questions or concerns about these Terms, please contact:
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
