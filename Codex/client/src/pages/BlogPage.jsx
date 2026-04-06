import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import Seo from "../components/Seo";
import SectionTitle from "../components/SectionTitle";
import { createBreadcrumbSchema, createLocalBusinessSchema } from "../utils/seo";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    api.get("/blogs").then(({ data }) => setBlogs(data));
  }, []);

  return (
    <>
      <Seo
        title="Khajuraho Travel Blog | Taxi Tips, Routes, and Tour Guides"
        description="Read Khajuraho travel guides, Panna route tips, sightseeing ideas, and local taxi advice from Khajuraho Roads."
        keywords={[
          "Khajuraho travel blog",
          "Khajuraho travel guide",
          "Khajuraho to Panna travel guide",
          "best taxi service in Khajuraho"
        ]}
        path="/blog"
        schema={[
          createLocalBusinessSchema(),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" }
          ])
        ]}
      />

      <main className="section-shell py-12">
        <SectionTitle
          eyebrow="Travel Blog"
          title="Local guides that help tourists plan Khajuraho and Panna better"
          description="Useful route ideas, sightseeing suggestions, and taxi-planning articles for local and outstation travelers."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {blogs.map((post) => (
            <article key={post.slug} className="glass-panel overflow-hidden">
              <img src={post.heroImage} alt={post.title} loading="lazy" className="h-52 w-full object-cover" />
              <div className="p-6">
                <p className="eyebrow">{new Date(post.publishedAt).toLocaleDateString("en-IN")}</p>
                <h2 className="mt-4 font-display text-3xl text-ink">{post.title}</h2>
                <p className="mt-4 text-sm leading-7 text-stone-600">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="primary-button mt-6">
                  Read Guide
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
