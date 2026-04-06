import Car from "../models/Car.js";
import Package from "../models/Package.js";
import Blog from "../models/Blog.js";
import { env } from "../config/env.js";
import { slugify } from "../utils/slugify.js";

function toAbsolute(pathname) {
  return new URL(pathname, env.siteUrl).toString();
}

export async function buildSitemapXml() {
  const [cars, packages, blogs] = await Promise.all([
    Car.find().select("slug updatedAt").lean(),
    Package.find().select("name slug updatedAt").lean(),
    Blog.find({ status: "published" }).select("slug publishedAt updatedAt").lean()
  ]);

  const staticRoutes = [
    "/",
    "/khajuraho-taxi-service",
    "/cars",
    "/car-rental-in-khajuraho",
    "/packages",
    "/booking",
    "/gallery",
    "/blog"
  ];

  const urlEntries = [
    ...staticRoutes.map((pathname) => ({
      loc: toAbsolute(pathname),
      lastmod: new Date().toISOString()
    })),
    ...cars.map((car) => ({
      loc: toAbsolute(`/cars/${car.slug}`),
      lastmod: new Date(car.updatedAt || Date.now()).toISOString()
    })),
    ...packages.map((travelPackage) => ({
      loc: toAbsolute(`/packages/${travelPackage.slug || slugify(travelPackage.name)}`),
      lastmod: new Date(travelPackage.updatedAt || Date.now()).toISOString()
    })),
    ...blogs.map((post) => ({
      loc: toAbsolute(`/blog/${post.slug}`),
      lastmod: new Date(post.updatedAt || post.publishedAt || Date.now()).toISOString()
    }))
  ];

  const xmlEntries = urlEntries
    .map(
      (entry) => `<url><loc>${entry.loc}</loc><lastmod>${entry.lastmod}</lastmod></url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}

export function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${toAbsolute("/sitemap.xml")}`;
}

export async function buildSeoSyncUrls() {
  const [cars, packages, blogs] = await Promise.all([
    Car.find().select("slug").lean(),
    Package.find().select("name slug").lean(),
    Blog.find({ status: "published" }).select("slug").lean()
  ]);

  const staticRoutes = [
    "/",
    "/khajuraho-taxi-service",
    "/cars",
    "/car-rental-in-khajuraho",
    "/packages",
    "/booking",
    "/gallery",
    "/blog",
    "/sitemap.xml",
    "/robots.txt"
  ];

  return [
    ...staticRoutes.map((pathname) => toAbsolute(pathname)),
    ...cars.map((car) => toAbsolute(`/cars/${car.slug}`)),
    ...packages.map((travelPackage) =>
      toAbsolute(`/packages/${travelPackage.slug || slugify(travelPackage.name)}`)
    ),
    ...blogs.map((blog) => toAbsolute(`/blog/${blog.slug}`))
  ];
}
