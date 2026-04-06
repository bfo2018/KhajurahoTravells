import { Mail, MessageCircleMore, Phone } from "lucide-react";
import { siteConfig } from "../utils/siteConfig";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-24 right-4 z-40 hidden flex-col gap-3 md:flex">
      <a
        href={`https://wa.me/${siteConfig.business.whatsappNumber}?text=Hello%20Khajuraho%20Roads,%20I%20want%20to%20book%20a%20car.`}
        target="_blank"
        rel="noreferrer"
        className="rounded-full bg-emerald-500 p-4 text-white shadow-soft"
      >
        <MessageCircleMore size={20} />
      </a>
      <a href={`tel:${siteConfig.business.phone.replace(/\s+/g, "")}`} className="rounded-full bg-bronze p-4 text-white shadow-soft">
        <Phone size={20} />
      </a>
      <a
        href={`mailto:${siteConfig.business.email}`}
        className="rounded-full bg-ink p-4 text-white shadow-soft"
      >
        <Mail size={20} />
      </a>
    </div>
  );
}
