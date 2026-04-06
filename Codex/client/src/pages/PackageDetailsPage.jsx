import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import Seo from "../components/Seo";
import {
  createBreadcrumbSchema,
  createLocalBusinessSchema,
  createProductSchema
} from "../utils/seo";
import { formatCurrency } from "../utils/formatters";
import { siteConfig } from "../utils/siteConfig";
import { slugify } from "../utils/slugify";
import { getGeneratedOgImageUrl } from "../utils/media";

export default function PackageDetailsPage() {
  const { slug } = useParams();
  const [travelPackage, setTravelPackage] = useState(null);

  useEffect(() => {
    api.get(`/packages/slug/${slug}`).then(({ data }) => setTravelPackage(data));
  }, [slug]);

  if (!travelPackage) {
    return <main className="section-shell py-16">Loading package details...</main>;
  }

  const pagePath = `/packages/${travelPackage.slug || slugify(travelPackage.name)}`;
  const socialImage =
    travelPackage.ogImage ||
    getGeneratedOgImageUrl("package", travelPackage.slug || slugify(travelPackage.name)) ||
    travelPackage.heroImage ||
    "/media/travel-panna.svg";

  return (
    <>
      <Seo
        title={`${travelPackage.name} | Khajuraho Tour Package`}
        description={`${travelPackage.description} Book ${travelPackage.name} from Khajuraho Roads starting at ${formatCurrency(travelPackage.price)}.`}
        keywords={[
          travelPackage.name,
          "Khajuraho tour packages",
          "Khajuraho taxi package",
          "Panna tour package"
        ]}
        path={pagePath}
        image={socialImage}
        type="product"
        schema={[
          createLocalBusinessSchema(),
          createProductSchema({
            name: travelPackage.name,
            description: travelPackage.description,
            image: socialImage,
            url: pagePath,
            price: travelPackage.price,
            category: "Tour Package"
          }),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Packages", path: "/packages" },
            { name: travelPackage.name, path: pagePath }
          ])
        ]}
      />

      <main className="section-shell py-12">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="glass-panel overflow-hidden">
            <img
              src={travelPackage.heroImage || travelPackage.ogImage || "/media/travel-panna.svg"}
              alt={travelPackage.name}
              className="h-[360px] w-full object-cover"
            />
            <div className="p-8">
              <p className="eyebrow">{travelPackage.duration}</p>
              <h1 className="mt-4 font-display text-5xl text-ink">{travelPackage.name}</h1>
              <p className="mt-5 text-base leading-8 text-stone-600">{travelPackage.description}</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-stone-100 p-5">
                  <p className="text-sm text-stone-500">Base Price</p>
                  <p className="mt-2 text-2xl font-bold text-ink">
                    {formatCurrency(travelPackage.price)}
                  </p>
                </div>
                <div className="rounded-3xl bg-stone-100 p-5">
                  <p className="text-sm text-stone-500">Included KM</p>
                  <p className="mt-2 text-2xl font-bold text-ink">{travelPackage.includedKm} km</p>
                </div>
                <div className="rounded-3xl bg-stone-100 p-5">
                  <p className="text-sm text-stone-500">Extra KM</p>
                  <p className="mt-2 text-2xl font-bold text-ink">
                    {formatCurrency(travelPackage.extraPerKm)}/km
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="glass-panel p-8">
              <p className="eyebrow">Package Highlights</p>
              <h2 className="mt-4 font-display text-3xl text-ink">Built for tourist-friendly day plans</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-stone-600">
                <p>Hotel or airport pickup can be aligned with your selected start time.</p>
                <p>Fare remains fixed up to the included distance shown above.</p>
                <p>Any extra usage after the included limit is billed transparently per kilometer.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={`/booking?package=${travelPackage._id}`} className="primary-button">
                  Book Package
                </Link>
                <Link to="/packages" className="secondary-button">
                  View All Packages
                </Link>
              </div>
            </div>

            <div className="glass-panel p-8">
              <p className="eyebrow">Need Help?</p>
              <h2 className="mt-4 font-display text-3xl text-ink">Talk to our travel desk</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                Contact us for custom pickup timing, return planning, temple combinations, and same-day travel advice.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`tel:${siteConfig.business.phone.replace(/\s+/g, "")}`} className="secondary-button">
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${siteConfig.business.whatsappNumber}?text=Hello%20I%20want%20to%20book%20this%20package.`}
                  target="_blank"
                  rel="noreferrer"
                  className="primary-button"
                >
                  WhatsApp Booking
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
