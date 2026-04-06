import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import SectionTitle from "../components/SectionTitle";
import Seo from "../components/Seo";
import { createBreadcrumbSchema, createLocalBusinessSchema } from "../utils/seo";
import { formatCurrency } from "../utils/formatters";
import { slugify } from "../utils/slugify";
import { trackPackageClick } from "../utils/tracking";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    api.get("/packages").then(({ data }) => setPackages(data));
  }, []);

  return (
    <>
      <Seo
        title="Khajuraho Tour Packages | Local, Panna, and Bageshwar Dham Trips"
        description="Compare Khajuraho tour packages with fixed prices, included kilometers, and instant booking for Panna, local sightseeing, and Bageshwar Dham routes."
        keywords={[
          "Khajuraho tour packages",
          "Khajuraho to Panna taxi package",
          "Khajuraho local tour",
          "Bageshwar Dham taxi from Khajuraho"
        ]}
        path="/packages"
        schema={[
          createLocalBusinessSchema(),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Packages", path: "/packages" }
          ])
        ]}
      />
      <main className="section-shell py-12">
        <SectionTitle
          eyebrow="Tour Packages"
          title="Fixed-price packages for Khajuraho, Bageshwar Dham, and Panna"
          description="Book curated one-day packages with clear included kilometers and extra-kilometer pricing."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((travelPackage) => (
            <article key={travelPackage._id} className="glass-panel relative flex flex-col p-6">
              {(travelPackage.heroImage || travelPackage.ogImage) && (
                <img
                  src={travelPackage.heroImage || travelPackage.ogImage}
                  alt={travelPackage.name}
                  loading="lazy"
                  className="mb-6 h-48 w-full rounded-[24px] object-cover"
                />
              )}
              {travelPackage.bestSeller && (
                <span className="absolute right-5 top-5 rounded-full bg-dune px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                  Best Seller
                </span>
              )}
              <p className="eyebrow">{travelPackage.duration}</p>
              <h2 className="mt-4 font-display text-3xl text-ink">{travelPackage.name}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">{travelPackage.description}</p>
              <div className="mt-6 grid gap-3 text-sm text-stone-600">
                <div className="rounded-2xl bg-stone-100 px-4 py-3">
                  Price: {formatCurrency(travelPackage.price)}
                </div>
                <div className="rounded-2xl bg-stone-100 px-4 py-3">
                  Included KM: {travelPackage.includedKm || "Route based"}
                </div>
                <div className="rounded-2xl bg-stone-100 px-4 py-3">
                  Extra per KM: {formatCurrency(travelPackage.extraPerKm)}
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  to={`/booking?package=${travelPackage._id}`}
                  className="primary-button flex-1"
                  onClick={() => trackPackageClick(travelPackage)}
                >
                  Book Package
                </Link>
                <Link
                  to={`/packages/${travelPackage.slug || slugify(travelPackage.name)}`}
                  className="secondary-button flex-1"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
