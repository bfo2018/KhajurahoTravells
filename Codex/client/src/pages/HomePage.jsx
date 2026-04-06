import { useEffect, useState } from "react";
import { ArrowRight, CircleCheckBig, Languages, Plane, Route, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/client";
import SectionTitle from "../components/SectionTitle";
import CarCard from "../components/CarCard";
import Seo from "../components/Seo";
import {
  createBreadcrumbSchema,
  createLocalBusinessSchema
} from "../utils/seo";
import { siteConfig } from "../utils/siteConfig";
import { slugify } from "../utils/slugify";
import { trackPackageClick } from "../utils/tracking";

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: "Khajuraho Airport",
    dropLocation: "Western Temple Group",
    travelDate: "",
    car: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/cars/featured").then(({ data }) => setFeaturedCars(data));
    api.get("/packages").then(({ data }) => setPackages(data.slice(0, 3)));
    api.get("/blogs").then(({ data }) => setBlogs(data.slice(0, 3)));
  }, []);

  return (
    <>
      <Seo
        title="Khajuraho Taxi Service | Cab Booking | Panna Tour Packages"
        description="Book Khajuraho taxi service, airport pickup, local sightseeing cabs, and Panna tour packages with multilingual drivers and transparent fares."
        keywords={[
          "Khajuraho taxi service",
          "Khajuraho cab booking",
          "Khajuraho airport pickup",
          "Panna tour packages",
          "car rental in Khajuraho"
        ]}
        path="/khajuraho-taxi-service"
        schema={[
          createLocalBusinessSchema(),
          createBreadcrumbSchema([
            { name: "Home", path: "/" }
          ])
        ]}
      />

      <main>
        <section className="section-shell py-10 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-panel bg-hero-glow p-8 lg:p-12"
            >
              <p className="eyebrow">Khajuraho & Panna Tour Mobility</p>
              <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.95] text-ink md:text-7xl">
                Premium car booking for temples, safaris, airport rides, and outstation travel.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
                Built for tourists who want reliable transport, educated multilingual drivers,
                transparent per-kilometer pricing, and smooth travel across Khajuraho, Panna,
                Raneh Falls, and nearby destinations.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/booking" className="primary-button gap-2">
                  Start Booking
                  <ArrowRight size={16} />
                </Link>
                <Link to="/car-rental-in-khajuraho" className="secondary-button">
                  Explore Fleet
                </Link>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {[
                  ["24/7", "Airport & hotel transfers"],
                  ["4 Premium Cars", "Innova, Ertiga, Seltos, Scorpio N"],
                  ["Multi-Lingual", "Professional educated drivers"]
                ].map(([title, text]) => (
                  <div key={title} className="rounded-[24px] border border-white/60 bg-white/70 p-5">
                    <p className="text-xl font-bold text-ink">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="glass-panel overflow-hidden"
            >
              <div className="relative h-full min-h-[560px] overflow-hidden rounded-[28px] bg-[#f7ead7] p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,143,82,0.25),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent)]" />
                <div className="relative z-10">
                  <p className="eyebrow">Quick Booking</p>
                  <h2 className="mt-4 font-display text-4xl text-ink">Find the right car fast.</h2>
                  <form
                    className="mt-8 space-y-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const params = new URLSearchParams(bookingForm);
                      navigate(`/booking?${params.toString()}`);
                    }}
                  >
                    <input
                      className="w-full rounded-2xl border border-white/70 bg-white/90 px-5 py-4 outline-none"
                      value={bookingForm.pickupLocation}
                      onChange={(event) =>
                        setBookingForm((current) => ({
                          ...current,
                          pickupLocation: event.target.value
                        }))
                      }
                      placeholder="Pickup"
                    />
                    <input
                      className="w-full rounded-2xl border border-white/70 bg-white/90 px-5 py-4 outline-none"
                      value={bookingForm.dropLocation}
                      onChange={(event) =>
                        setBookingForm((current) => ({
                          ...current,
                          dropLocation: event.target.value
                        }))
                      }
                      placeholder="Drop location"
                    />
                    <input
                      type="date"
                      className="w-full rounded-2xl border border-white/70 bg-white/90 px-5 py-4 outline-none"
                      value={bookingForm.travelDate}
                      onChange={(event) =>
                        setBookingForm((current) => ({
                          ...current,
                          travelDate: event.target.value
                        }))
                      }
                    />
                    <select
                      className="w-full rounded-2xl border border-white/70 bg-white/90 px-5 py-4 outline-none"
                      value={bookingForm.car}
                      onChange={(event) =>
                        setBookingForm((current) => ({ ...current, car: event.target.value }))
                      }
                    >
                      <option value="">Select car category</option>
                      <option value="Toyota Innova">Toyota Innova</option>
                      <option value="Maruti Ertiga">Maruti Ertiga</option>
                      <option value="Kia Seltos">Kia Seltos</option>
                      <option value="Scorpio N">Scorpio N</option>
                    </select>
                    <button type="submit" className="primary-button w-full">
                      Continue to Booking
                    </button>
                  </form>
                  <div className="mt-10 space-y-4 text-sm text-stone-700">
                    <div className="flex items-start gap-3">
                      <CircleCheckBig className="mt-0.5 text-dune" size={18} />
                      <p>Dynamic pricing with rate per kilometer and minimum booking distance.</p>
                      
                    </div>
                    <div className="flex items-start gap-3">
                      <CircleCheckBig className="mt-0.5 text-dune" size={18} />
                      <p>Booking stored in backend with live status: Pending, Confirmed, Completed.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section-shell py-8">
          <SectionTitle
            eyebrow="Why choose us"
            title="A complete local travel desk for Khajuraho and Panna"
            description="Your website now shows the real strengths of a modern tour and travels business: curated vehicles, route clarity, booking confidence, and premium local guidance."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Route,
                title: "Local & Outstation Rides",
                text: "Temple visits, hotel transfers, Khajuraho to Panna, Raneh Falls, and custom routes."
              },
              {
                icon: Plane,
                title: "Airport & Railway Pickup",
                text: "24/7 coordination for flight arrivals, station pickup, and direct drop service."
              },
              {
                icon: Languages,
                title: "Educated Drivers",
                text: "Drivers speak Hindi, English, and regional languages for tourist-friendly support."
              },
              {
                icon: ShieldCheck,
                title: "Transparent Pricing",
                text: "Distance-based fare logic with vehicle-specific rates and booking status tracking."
              }
            ].map((item) => (
              <div key={item.title} className="glass-panel p-6">
                <item.icon className="text-dune" size={28} />
                <h3 className="mt-5 text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell py-10">
          <SectionTitle
            eyebrow="Featured Fleet"
            title="Cars tourists ask for again and again"
            description="Each vehicle has a full details page with gallery, pricing, driver profile, and direct booking flow."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {featuredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        </section>

        <section className="section-shell py-10">
          <SectionTitle
            eyebrow="Best Selling Packages"
            title="Fixed-price tours for the routes travelers book most"
            description="Choose a ready-made package with clear included kilometers and extra-kilometer pricing."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {packages.map((travelPackage) => (
              <div key={travelPackage._id} className="glass-panel relative p-6">
                {travelPackage.bestSeller && (
                  <span className="absolute right-5 top-5 rounded-full bg-dune px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                    Best Seller
                  </span>
                )}
                <p className="eyebrow">{travelPackage.duration}</p>
                <h3 className="mt-4 font-display text-3xl text-ink">{travelPackage.name}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{travelPackage.description}</p>
                <div className="mt-6 grid gap-3 text-sm text-stone-600">
                  <div className="rounded-2xl bg-stone-100 px-4 py-3">Base Price: Rs. {travelPackage.price}</div>
                  <div className="rounded-2xl bg-stone-100 px-4 py-3">Included KM: {travelPackage.includedKm || "Route based"}</div>
                  <div className="rounded-2xl bg-stone-100 px-4 py-3">Extra: Rs. {travelPackage.extraPerKm}/km</div>
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
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell py-10">
          <SectionTitle
            eyebrow="Travel Blog"
            title="Helpful guides that strengthen local SEO and help real travelers"
            description="Useful city insights, route ideas, and travel-planning tips that connect directly to our packages and booking pages."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {blogs.map((post) => (
              <article key={post.slug} className="glass-panel overflow-hidden">
                <img
                  src={post.heroImage}
                  alt={post.title}
                  loading="lazy"
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <p className="eyebrow">{new Date(post.publishedAt).toLocaleDateString("en-IN")}</p>
                  <h3 className="mt-4 font-display text-3xl text-ink">{post.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-stone-600">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="primary-button mt-6">
                    Read Article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell py-10">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="glass-panel p-8">
              <p className="eyebrow">Local SEO</p>
              <h2 className="mt-4 font-display text-4xl text-ink">Find us in Khajuraho, call fast, or chat on WhatsApp</h2>
              <p className="mt-4 text-base leading-8 text-stone-600">
                Our travel desk serves Khajuraho, Panna, airport transfers, temple circuits, and outstation routes with quick support for tourists.
              </p>
              <div className="mt-8 grid gap-4">
                <a href={`tel:${siteConfig.business.phone.replace(/\s+/g, "")}`} className="primary-button">
                  Call {siteConfig.business.phone}
                </a>
                <a
                  href={`https://wa.me/${siteConfig.business.whatsappNumber}?text=Hello%20I%20want%20to%20book%20a%20cab%20in%20Khajuraho.`}
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-button"
                >
                  WhatsApp Chat
                </a>
                <a href={`mailto:${siteConfig.business.email}`} className="text-sm leading-7 text-stone-600 hover:text-ink">
                  Email: {siteConfig.business.email}
                </a>
              </div>
            </div>
            <div className="glass-panel p-8">
              <p className="eyebrow">Reach Us Fast</p>
              <h3 className="mt-4 font-display text-4xl text-ink">Prefer WhatsApp first</h3>
              <p className="mt-4 text-base leading-8 text-stone-600">
                We are currently keeping the exact office address private on the website. For location sharing, route help, or direct travel coordination, message us on WhatsApp and our team will guide you personally.
              </p>
              <div className="mt-8 space-y-4 rounded-[28px] bg-stone-100 p-6">
                <p className="text-sm text-stone-500">WhatsApp</p>
                <a
                  href={`https://wa.me/${siteConfig.business.whatsappNumber}?text=Hello%20please%20share%20your%20location%20and%20booking%20details.`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-2xl font-semibold text-ink"
                >
                  {siteConfig.business.phone}
                </a>
                <p className="text-sm leading-7 text-stone-600">
                  Share your travel plan and we will reply with booking assistance, pickup support, and direct coordination details.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell py-10">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-panel p-8">
              <p className="eyebrow">Travel Coverage</p>
              <h2 className="mt-4 font-display text-4xl text-ink">Popular routes we serve every week</h2>
              <div className="mt-8 grid gap-4 text-sm text-stone-600">
                {[
                  "Khajuraho Airport to Hotels",
                  "Western Temple Group Sightseeing",
                  "Khajuraho to Panna National Park",
                  "Khajuraho to Raneh Falls",
                  "Wedding guest movement in town",
                  "Railway pickup and same-day return rides"
                ].map((route) => (
                  <div key={route} className="rounded-2xl bg-stone-100 px-4 py-4">
                    {route}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel overflow-hidden">
              <iframe
                title="Khajuraho Map"
                src="https://www.google.com/maps?q=Khajuraho%20Madhya%20Pradesh&output=embed"
                className="h-[420px] w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
