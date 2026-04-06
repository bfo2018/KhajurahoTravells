import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import Seo from "../components/Seo";
import {
  createArticleSchema,
  createBreadcrumbSchema,
  createLocalBusinessSchema
} from "../utils/seo";
import { getGeneratedOgImageUrl } from "../utils/media";

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/blogs/slug/${slug}`).then(({ data }) => setPost(data));
  }, [slug]);

  if (!post) {
    return <main className="section-shell py-16">Loading article...</main>;
  }

  const socialImage =
    post.ogImage || getGeneratedOgImageUrl("blog", post.slug) || post.heroImage;
  const schemaPost = { ...post, ogImage: socialImage };

  return (
    <>
      <Seo
        title={`${post.title} | Khajuraho Roads Blog`}
        description={post.description}
        keywords={post.keywords}
        path={`/blog/${post.slug}`}
        image={socialImage}
        type="article"
        schema={[
          createLocalBusinessSchema(),
          createArticleSchema(schemaPost),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` }
          ])
        ]}
      />

      <main className="section-shell py-12">
        <article className="mx-auto max-w-4xl">
          <img src={post.heroImage} alt={post.title} className="h-[340px] w-full rounded-[32px] object-cover" />
          <p className="eyebrow mt-8">{new Date(post.publishedAt).toLocaleDateString("en-IN")}</p>
          <h1 className="mt-4 font-display text-5xl text-ink">{post.title}</h1>
          <p className="mt-6 text-lg leading-8 text-stone-600">{post.excerpt}</p>

          <div className="mt-10 space-y-8">
            {post.sections.map((section) => (
              <section key={section.heading} className="glass-panel p-8">
                <h2 className="font-display text-3xl text-ink">{section.heading}</h2>
                <p className="mt-4 text-base leading-8 text-stone-600">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/booking" className="primary-button">
              Book a Cab
            </Link>
            <Link to="/packages" className="secondary-button">
              Explore Packages
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
