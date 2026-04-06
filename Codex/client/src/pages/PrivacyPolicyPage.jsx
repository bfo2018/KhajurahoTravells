import PolicyLayout from "../components/PolicyLayout";

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      description="This Privacy Policy explains how Khajuraho Roads collects, uses, and protects customer information when you use our website and booking services."
      path="/privacy-policy"
    >
      <section>
        <h2 className="font-display text-3xl text-ink">Information We Collect</h2>
        <p className="mt-3">
          We may collect your name, phone number, email address, pickup and drop details,
          travel date and time, booking preferences, and any notes you submit while making an
          inquiry or booking.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">How We Use Your Information</h2>
        <p className="mt-3">
          We use your information to manage bookings, respond to travel inquiries, confirm ride
          details, provide customer support, improve our website, and maintain booking records for
          operational purposes.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Cookies and Analytics</h2>
        <p className="mt-3">
          Our website may use cookies for essential session handling, booking continuity, site
          analytics, and marketing preferences where consent is given. You can update your cookie
          choices anytime through the Cookie Settings link on the website.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Data Sharing</h2>
        <p className="mt-3">
          We do not sell customer information. Data may be shared only when reasonably required to
          operate the service, comply with legal obligations, process communications, or manage
          website infrastructure and hosting tools.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Data Security</h2>
        <p className="mt-3">
          We take reasonable steps to protect customer data, but no online platform can guarantee
          absolute security. Customers should avoid sharing unnecessary sensitive information in
          open text fields.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Your Rights</h2>
        <p className="mt-3">
          You may contact us to request correction or deletion of inaccurate personal information,
          subject to any legal or business recordkeeping requirements that may apply.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Contact</h2>
        <p className="mt-3">
          For privacy-related questions, please contact Khajuraho Roads through the contact details
          listed on this website.
        </p>
      </section>
    </PolicyLayout>
  );
}
