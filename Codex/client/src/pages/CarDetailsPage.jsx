import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Languages, PlayCircle, Users } from "lucide-react";
import api from "../api/client";
import Seo from "../components/Seo";
import { formatCurrency } from "../utils/formatters";
import { resolveMediaUrl } from "../utils/media";
import { getCarGallery } from "../utils/carGallery";
import {
  createBreadcrumbSchema,
  createLocalBusinessSchema,
  createProductSchema
} from "../utils/seo";
import { trackViewContent } from "../utils/tracking";

export default function CarDetailsPage() {
  const { slug } = useParams();
  const [car, setCar] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    api.get(`/cars/${slug}`).then(({ data }) => setCar(data));
  }, [slug]);

  useEffect(() => {
    if (!car) return;
    trackViewContent("car", { name: car.name, value: car.pricePerKm });
  }, [car]);

  if (!car) {
    return <main className="section-shell py-16">Loading car details...</main>;
  }

  const gallery = getCarGallery(car);

  return (
    <>
      <Seo
        title={`${car.name} | Car Rental in Khajuraho`}
        description={`${car.summary} Book ${car.name} in Khajuraho for airport pickup, local sightseeing, and outstation rides from ${formatCurrency(car.pricePerKm)}/km.`}
        keywords={[
          `${car.name} in Khajuraho`,
          "car rental in Khajuraho",
          "Khajuraho taxi service",
          `${car.type} on rent in Khajuraho`
        ]}
        path={`/cars/${car.slug}`}
        image={gallery[0]}
        type="product"
        schema={[
          createLocalBusinessSchema(),
          createProductSchema({
            name: car.name,
            description: car.description,
            image: gallery[0],
            url: `/cars/${car.slug}`,
            price: car.pricePerKm,
            category: "Car Rental"
          }),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cars", path: "/cars" },
            { name: car.name, path: `/cars/${car.slug}` }
          ])
        ]}
      />
      <main className="section-shell py-12">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="glass-panel p-6">
            <img
              src={resolveMediaUrl(gallery[selectedImage])}
              alt={car.name}
              loading="eager"
              decoding="async"
              className="h-[420px] w-full rounded-[24px] object-cover"
            />
            <div className="mt-4 grid grid-cols-3 gap-4">
              {gallery.map((image, index) => (
                <button key={image} type="button" onClick={() => setSelectedImage(index)}>
                  <img
                    src={resolveMediaUrl(image)}
                    alt={`${car.name} ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-28 w-full rounded-2xl object-cover"
                  />
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="glass-panel p-8">
              <p className="eyebrow">{car.type}</p>
              <h1 className="mt-4 font-display text-5xl text-ink">{car.name}</h1>
              <p className="mt-5 text-base leading-8 text-stone-600">{car.description}</p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-stone-100 p-5">
                  <p className="text-sm text-stone-500">Rate</p>
                  <p className="mt-1 text-2xl font-bold text-ink">
                    {formatCurrency(car.pricePerKm)}/km
                  </p>
                  <p className="mt-2 text-sm text-stone-600">
                    Fare is calculated from actual route distance during booking
                  </p>
                </div>
                <div className="rounded-3xl bg-stone-100 p-5">
                  <p className="text-sm text-stone-500">Capacity</p>
                  <p className="mt-1 text-2xl font-bold text-ink">{car.seatingCapacity} Seats</p>
                  <p className="mt-2 text-sm text-stone-600">{car.luggage} luggage space</p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {car.highlights.map((item) => (
                  <span key={item} className="rounded-full bg-[#f4e7d4] px-4 py-2 text-sm text-bronze">
                    {item}
                  </span>
                ))}
              </div>
              <Link to={`/booking?car=${car._id}`} className="primary-button mt-8 w-full">
                Book Now
              </Link>
            </div>

            <div className="glass-panel p-8">
              <p className="eyebrow">Driver Details</p>
              <h2 className="mt-4 font-display text-3xl text-ink">{car.driverProfile.name}</h2>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2">
                  <Users size={16} />
                  {car.driverProfile.experience}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2">
                  <Languages size={16} />
                  {car.driverProfile.languages.join(", ")}
                </span>
              </div>
              <p className="mt-5 text-sm leading-7 text-stone-600">{car.driverProfile.bio}</p>
              <div className="mt-6 overflow-hidden rounded-[24px] border border-dashed border-stone-300 bg-stone-50">
                {car.driverProfile.videoUrl ? (
                  <video controls className="w-full" src={resolveMediaUrl(car.driverProfile.videoUrl)} />
                ) : (
                  <div className="flex h-52 items-center justify-center gap-3 text-stone-500">
                    <PlayCircle />
                    Driver welcome video can be uploaded from the admin panel
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
