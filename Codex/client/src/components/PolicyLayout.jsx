import Seo from "./Seo";

export default function PolicyLayout({ title, description, path, children }) {
  return (
    <>
      <Seo title={`${title} | Khajuraho Roads`} description={description} path={path} />
      <main className="section-shell py-12">
        <article className="mx-auto max-w-4xl glass-panel p-8 lg:p-10">
          <p className="eyebrow">Policy</p>
          <h1 className="mt-4 font-display text-5xl text-ink">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-stone-600">{description}</p>
          <div className="mt-10 space-y-8 text-sm leading-8 text-stone-700">{children}</div>
        </article>
      </main>
    </>
  );
}
