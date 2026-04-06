import PolicyLayout from "../components/PolicyLayout";

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      description="These Terms & Conditions govern the use of the Khajuraho Roads website and our local and outstation cab booking services."
      path="/terms-and-conditions"
    >
      <section>
        <h2 className="font-display text-3xl text-ink">Service Scope</h2>
        <p className="mt-3">
          Khajuraho Roads provides travel information, ride booking support, local sightseeing
          transport, airport pickup, outstation rides, and selected package-based travel services
          in and around Khajuraho and Panna.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Booking Accuracy</h2>
        <p className="mt-3">
          Customers are responsible for entering correct travel dates, time, contact details,
          pickup information, and destination information. Service delays or issues caused by
          incorrect information may affect the booking experience.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Pricing</h2>
        <p className="mt-3">
          Fare estimates shown on the website are based on the selected vehicle, route, package,
          and distance logic available at the time of booking. Final operational details may vary
          if the customer changes the route, travel duration, or selected service.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Availability</h2>
        <p className="mt-3">
          Vehicle availability is subject to scheduling, demand, local conditions, maintenance
          requirements, and operational constraints. We reserve the right to provide a comparable
          alternative vehicle where reasonably necessary.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Customer Conduct</h2>
        <p className="mt-3">
          Customers are expected to behave respectfully with drivers and support staff. We may
          refuse or discontinue service in situations involving unsafe, unlawful, abusive, or
          inappropriate conduct.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Website Content</h2>
        <p className="mt-3">
          We make reasonable efforts to keep website content accurate and up to date, but route
          suggestions, travel articles, pricing displays, and service descriptions may change from
          time to time as business operations evolve.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Changes to Terms</h2>
        <p className="mt-3">
          These terms may be updated when needed. Continued use of the website or booking service
          after updates means you accept the revised terms.
        </p>
      </section>
    </PolicyLayout>
  );
}
