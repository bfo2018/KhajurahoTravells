import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { formatCurrency, formatDate } from "../utils/formatters";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    api
      .get(`/bookings/user/${user.id}`)
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <>
      <Helmet>
        <title>My Bookings | Khajuraho Roads</title>
      </Helmet>
      <main className="section-shell py-12">
        <div className="glass-panel p-8">
          <p className="eyebrow">Customer Dashboard</p>
          <h1 className="mt-4 font-display text-5xl text-ink">My Bookings</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-stone-600">
            View your car and package bookings with booking ID, route, price, and live status.
          </p>
        </div>
        <div className="mt-8 glass-panel p-8">
          {loading ? (
            <p className="text-stone-600">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-stone-600">
              No bookings found yet. Once you book a car or package, it will appear here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500">
                    <th className="px-4 py-3">Booking ID</th>
                    <th className="px-4 py-3">Car / Package</th>
                    <th className="px-4 py-3">Pickup & Drop</th>
                    <th className="px-4 py-3">Date & Time</th>
                    <th className="px-4 py-3">Total Price</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-stone-100">
                      <td className="px-4 py-4 font-medium text-ink">{booking.bookingNumber}</td>
                      <td className="px-4 py-4">
                        {booking.bookingType === "PACKAGE"
                          ? booking.packageName || booking.package?.name
                          : booking.car?.name}
                      </td>
                      <td className="px-4 py-4">
                        {booking.pickupLocation} to {booking.dropLocation}
                      </td>
                      <td className="px-4 py-4">
                        {formatDate(booking.travelDate)} • {booking.travelTime}
                      </td>
                      <td className="px-4 py-4">{formatCurrency(booking.totalPrice)}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-stone-100 px-3 py-2 font-medium text-stone-700">
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
