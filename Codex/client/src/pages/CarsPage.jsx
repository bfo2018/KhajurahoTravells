import { useEffect, useState } from "react";
import api from "../api/client";
import CarCard from "../components/CarCard";
import { CardGridLoader } from "../components/ContentLoader";
import SectionTitle from "../components/SectionTitle";
import Seo from "../components/Seo";
import { createBreadcrumbSchema, createLocalBusinessSchema } from "../utils/seo";

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [filters, setFilters] = useState({
    maxPrice: "",
    seating: "",
    type: ""
  });

  useEffect(() => {
    let active = true;
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "")
    );

    setLoadingCars(true);

    api
      .get("/cars", { params })
      .then(({ data }) => {
        if (active) {
          setCars(data);
        }
      })
      .finally(() => {
        if (active) {
          setLoadingCars(false);
        }
      });

    return () => {
      active = false;
    };
  }, [filters]);

  return (
    <>
      <Seo
        title="Car Rental in Khajuraho | Innova, Ertiga, Seltos, Scorpio N"
        description="Browse car rental in Khajuraho with Innova, Ertiga, Kia Seltos, and Scorpio N. Filter by seating, type, AC, and per-kilometer pricing."
        keywords={[
          "car rental in Khajuraho",
          "Khajuraho cab booking",
          "Innova on rent in Khajuraho",
          "Khajuraho taxi service"
        ]}
        path="/car-rental-in-khajuraho"
        schema={[
          createLocalBusinessSchema(),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cars", path: "/cars" }
          ])
        ]}
      />
      <main className="section-shell py-12">
        <SectionTitle
          eyebrow="Fleet Listing"
          title="Browse every available car with filterable pricing and seating"
          description="Use price, seating, and type filters to find the right car for local temple rides, airport transfers, or outstation travel."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="glass-panel h-fit p-6">
            <h3 className="text-lg font-semibold text-ink">Filters</h3>
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-stone-700">
                Max price per KM
                <input
                  value={filters.maxPrice}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, maxPrice: event.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                  placeholder="16"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Minimum seating
                <input
                  value={filters.seating}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, seating: event.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                  placeholder="5"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Car type
                <select
                  value={filters.type}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, type: event.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                >
                  <option value="">All</option>
                  <option value="SUV">SUV</option>
                  <option value="MPV">MPV</option>
                  <option value="MUV">MUV</option>
                </select>
              </label>
            </div>
          </aside>
          {loadingCars ? (
            <CardGridLoader
              count={6}
              variant="car"
              columnsClassName="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
              {cars.length === 0 && (
                <div className="glass-panel p-8 text-sm leading-7 text-stone-600 md:col-span-2 xl:col-span-3">
                  No cars matched these filters yet.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}