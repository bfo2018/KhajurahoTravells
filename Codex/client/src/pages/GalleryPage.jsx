import Seo from "../components/Seo";
import SectionTitle from "../components/SectionTitle";
import { createBreadcrumbSchema, createLocalBusinessSchema } from "../utils/seo";
import { resolveMediaUrl } from "../utils/media";

const galleryItems = [
  { category: "Cars", image: "/media/innova-1.svg", title: "Toyota Innova touring setup" },
  { category: "Cars", image: "/media/seltos-1.svg", title: "Kia Seltos premium local ride" },
  { category: "Cars", image: "/media/scorpio-2.svg", title: "Scorpio N special guest movement" },
  { category: "Travel", image: "/media/travel-khajuraho.svg", title: "Khajuraho temple route" },
  { category: "Travel", image: "/media/travel-panna.svg", title: "Panna forest day trip" },
  { category: "Travel", image: "/media/travel-raneh.svg", title: "Raneh Falls outing" }
];

export default function GalleryPage() {
  return (
    <>
      <Seo
        title="Khajuraho Taxi Gallery | Cars, Routes, and Travel Moments"
        description="View the Khajuraho Roads gallery with fleet visuals, temple routes, Panna trip highlights, and travel inspiration for your next booking."
        keywords={[
          "Khajuraho taxi gallery",
          "Khajuraho car rental photos",
          "Panna tour photos",
          "Khajuraho travel gallery"
        ]}
        path="/gallery"
        schema={[
          createLocalBusinessSchema(),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Gallery", path: "/gallery" }
          ])
        ]}
      />
      <main className="section-shell py-12">
        <SectionTitle
          eyebrow="Gallery"
          title="Travel and fleet visuals for your booking website"
          description="The gallery supports categorized travel and vehicle visuals and can be expanded with uploaded images from the admin panel."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {galleryItems.map((item) => (
            <article key={item.title} className="glass-panel overflow-hidden">
              <img src={resolveMediaUrl(item.image)} alt={item.title} className="h-72 w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-dune">
                  {item.category}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-ink">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
