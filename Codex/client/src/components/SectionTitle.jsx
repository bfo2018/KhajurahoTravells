export default function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-4">{title}</h2>
      {description && <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">{description}</p>}
    </div>
  );
}
