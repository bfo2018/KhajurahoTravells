import PolicyLayout from "../components/PolicyLayout";

export default function CancellationPolicyPage() {
  return (
    <PolicyLayout
      title="Cancellation Policy"
      description="Khajuraho Roads currently does not process online payments through a payment gateway on this website, so cancellation handling is kept simple and customer-friendly."
      path="/cancellation-policy"
    >
      <section>
        <h2 className="font-display text-3xl text-ink">Cancellation Flexibility</h2>
        <p className="mt-3">
          Customers may request cancellation at any time before or during booking coordination by
          contacting our travel desk through phone, WhatsApp, or other available contact methods.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">No Online Payment Gateway</h2>
        <p className="mt-3">
          Since this website does not currently collect customer payments through an online payment
          gateway, no automated online refund process applies through the website itself.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Operational Costs</h2>
        <p className="mt-3">
          If a booking has already been specially arranged, a vehicle dispatched, or driver
          movement initiated, any practical charges or settlement details may be discussed directly
          with the customer based on the actual service situation.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">Rescheduling</h2>
        <p className="mt-3">
          Where possible, we may help customers reschedule instead of canceling, depending on
          vehicle availability, route timing, and travel demand on the requested date.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl text-ink">How to Cancel</h2>
        <p className="mt-3">
          Please share your booking number, name, travel date, and route details while requesting a
          cancellation so our team can respond faster and update the booking status correctly.
        </p>
      </section>
    </PolicyLayout>
  );
}
