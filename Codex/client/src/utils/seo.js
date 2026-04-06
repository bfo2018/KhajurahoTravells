import { siteConfig, toAbsoluteUrl } from "./siteConfig";

export function createLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.business.name,
    image: toAbsoluteUrl(siteConfig.defaultOgImage),
    url: siteConfig.siteUrl,
    telephone: siteConfig.business.phone,
    email: siteConfig.business.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Khajuraho",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN"
    },
    areaServed: ["Khajuraho", "Panna", "Raneh Falls", "Bageshwar Dham"],
    priceRange: "₹₹",
    sameAs: [`https://wa.me/${siteConfig.business.whatsappNumber}`],
    knowsAbout: siteConfig.business.services
  };
}

export function createProductSchema({
  name,
  description,
  image,
  url,
  price,
  category
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: [toAbsoluteUrl(image || siteConfig.defaultOgImage)],
    category,
    brand: siteConfig.business.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price,
      availability: "https://schema.org/InStock",
      url: toAbsoluteUrl(url)
    }
  };
}

export function createBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path)
    }))
  };
}

export function createArticleSchema(post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [toAbsoluteUrl(post.ogImage || post.heroImage || siteConfig.defaultOgImage)],
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.business.name
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.business.name,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl(siteConfig.defaultOgImage)
      }
    },
    mainEntityOfPage: toAbsoluteUrl(`/blog/${post.slug}`)
  };
}
