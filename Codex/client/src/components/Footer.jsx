import { Link } from "react-router-dom";
import { useCookieConsent } from "../context/CookieConsentContext";
import { siteConfig } from "../utils/siteConfig";

export default function Footer() {
  const { openSettings } = useCookieConsent();

  return (
    <footer className="mt-20 bg-[#1f1a17] py-12 text-stone-200">
      <div className="section-shell grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-display text-3xl">Khajuraho Roads</h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-stone-400">
            Premium local and outstation rides across Khajuraho, Panna, Raneh Falls, Panna
            National Park, airport pickup, wedding movement, and temple tours.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-300">
            <Link to="/packages" className="hover:text-white">
              Tour Packages
            </Link>
            <Link to="/cars" className="hover:text-white">
              Car Rental
            </Link>
            <Link to="/blog" className="hover:text-white">
              Travel Blog
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-dune">Contact</p>
          <div className="mt-4 space-y-3 text-sm text-stone-300">
            <p>Contact us directly on call, WhatsApp, or email for route guidance and booking support.</p>
            <a href={`tel:${siteConfig.business.phone.replace(/\s+/g, "")}`} className="block hover:text-white">
              {siteConfig.business.phone}
            </a>
            <a href={`mailto:${siteConfig.business.email}`} className="block hover:text-white">
              {siteConfig.business.email}
            </a>
            <a
              href={`https://wa.me/${siteConfig.business.whatsappNumber}?text=Hello%20I%20want%20to%20book%20a%20cab.`}
              target="_blank"
              rel="noreferrer"
              className="block hover:text-white"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-dune">Hours</p>
          <div className="mt-4 space-y-3 text-sm text-stone-300">
            <p>Airport Pickup: 24/7</p>
            <p>Travel Desk: 7:00 AM to 10:30 PM</p>
            <p>Admin Support: Real-time booking updates via dashboard</p>
            <Link to="/privacy-policy" className="block hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="block hover:text-white">
              Terms & Conditions
            </Link>
            <Link to="/cancellation-policy" className="block hover:text-white">
              Cancellation Policy
            </Link>
            <button type="button" className="hover:text-white" onClick={openSettings}>
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
