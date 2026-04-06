import { Link } from "react-router-dom";
import { Snowflake, Users } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { resolveMediaUrl } from "../utils/media";
import { getCarGallery } from "../utils/carGallery";

export default function CarCard({ car }) {
  const gallery = getCarGallery(car);

  return (
    <article className="glass-panel overflow-hidden">
      <img
        src={resolveMediaUrl(gallery[0])}
        alt={car.name}
        loading="lazy"
        decoding="async"
        className="h-56 w-full object-cover"
      />
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-dune">{car.type}</p>
            <h3 className="mt-2 font-display text-3xl text-ink">{car.name}</h3>
          </div>
          <div className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700">
            {formatCurrency(car.pricePerKm)}/km
          </div>
        </div>
        <p className="text-sm leading-7 text-stone-600">{car.summary}</p>
        <div className="flex flex-wrap gap-3 text-sm text-stone-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-2">
            <Users size={16} />
            {car.seatingCapacity} Seats
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-2">
            <Snowflake size={16} />
            {car.ac ? "AC" : "Non-AC"}
          </span>
        </div>
        <div className="flex gap-3">
          <Link to={`/cars/${car.slug}`} className="primary-button flex-1">
            View Details
          </Link>
          <Link to={`/booking?car=${car._id}`} className="secondary-button flex-1">
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}
