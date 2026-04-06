import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import Seo from "../components/Seo";
import { formatCurrency, formatDate } from "../utils/formatters";
import { siteConfig } from "../utils/siteConfig";
import { trackPurchase } from "../utils/tracking";

export default function BookingSuccessPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    api.get(`/bookings/${bookingId}`).then(({ data }) => setBooking(data));
  }, [bookingId]);

  useEffect(() => {
    if (!booking) return;
    trackPurchase({
      transaction_id: booking.bookingNumber,
      value: booking.totalPrice
    });
  }, [booking]);

  if (!booking) {
    return <main className="section-shell py-16">Loading confirmation...</main>;
  }

  return (
    <>
      <Seo title="Booking Confirmed | Khajuraho Roads" path={`/booking/success/${bookingId}`} noIndex />
      <main className="section-shell py-12">
        <div className="mx-auto max-w-3xl glass-panel p-8 text-center">
          <p className="eyebrow">Booking Confirmation</p>
          <h1 className="mt-4 font-display text-5xl text-ink">Your request has been received</h1>
          <p className="mt-5 text-lg leading-8 text-stone-600">
            Booking number <span className="font-semibold text-dune">{booking.bookingNumber}</span>
            {" "}has been stored successfully. Our team will review and confirm it shortly.
          </p>
          <div className="mt-10 grid gap-4 text-left md:grid-cols-2">
            <div className="rounded-3xl bg-stone-100 p-5">
              <p className="text-sm text-stone-500">Car</p>
              <p className="mt-2 text-xl font-semibold text-ink">
                {booking.bookingType === "PACKAGE"
                  ? booking.packageName || booking.package?.name
                  : booking.car?.name}
              </p>
            </div>
            <div className="rounded-3xl bg-stone-100 p-5">
              <p className="text-sm text-stone-500">Status</p>
              <p className="mt-2 text-xl font-semibold text-ink">{booking.status}</p>
            </div>
            <div className="rounded-3xl bg-stone-100 p-5">
              <p className="text-sm text-stone-500">Travel Date</p>
              <p className="mt-2 text-xl font-semibold text-ink">{formatDate(booking.travelDate)}</p>
            </div>
            <div className="rounded-3xl bg-stone-100 p-5">
              <p className="text-sm text-stone-500">Amount</p>
              <p className="mt-2 text-xl font-semibold text-ink">{formatCurrency(booking.totalPrice)}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${siteConfig.business.whatsappNumber}?text=My%20booking%20number%20is%20${booking.bookingNumber}`}
              className="primary-button"
              target="_blank"
              rel="noreferrer"
            >
              Share on WhatsApp
            </a>
            <Link to="/cars" className="secondary-button">
              Explore More Cars
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
