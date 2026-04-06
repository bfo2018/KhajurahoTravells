import { env } from "../config/env.js";
import Blog from "../models/Blog.js";
import Package from "../models/Package.js";
import {
  buildRobotsTxt,
  buildSeoSyncUrls,
  buildSitemapXml
} from "../services/seoService.js";
import { submitIndexNowUrls } from "../services/indexNowService.js";
import { buildOgSvg } from "../services/ogImageService.js";
import ApiError from "../utils/ApiError.js";

export async function getSitemap(_req, res, next) {
  try {
    const xml = await buildSitemapXml();
    res.type("application/xml").send(xml);
  } catch (error) {
    next(error);
  }
}

export function getRobots(_req, res) {
  res.type("text/plain").send(buildRobotsTxt());
}

export function getIndexNowKeyFile(_req, res) {
  if (!env.indexNowKey) {
    return res.status(404).send("IndexNow key not configured");
  }

  return res.type("text/plain").send(env.indexNowKey);
}

export async function submitIndexNow(req, res, next) {
  try {
    const urlList = Array.isArray(req.body?.urls) ? req.body.urls : [];
    const result = await submitIndexNowUrls(urlList);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function syncSeo(req, res, next) {
  try {
    const siteUrls = await buildSeoSyncUrls();
    const indexNow = await submitIndexNowUrls(siteUrls).catch((error) => ({
      submitted: false,
      reason: error.message
    }));

    res.json({
      ok: true,
      googleSitemapPingSupported: false,
      googleNote:
        "Google deprecated the public sitemap ping endpoint on June 26, 2023. Keep sitemap.xml available and submitted in Search Console.",
      indexNow,
      submittedUrlCount: siteUrls.length,
      urls: siteUrls
    });
  } catch (error) {
    next(error);
  }
}

export async function getBlogOgImage(req, res, next) {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).lean();

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    const svg = buildOgSvg({
      eyebrow: blog.status === "draft" ? "Draft Article" : "Khajuraho Travel Blog",
      title: blog.title,
      subtitle: blog.excerpt || blog.description,
      accent: "#b56a34"
    });

    res.type("image/svg+xml").send(svg);
  } catch (error) {
    next(error);
  }
}

export async function getPackageOgImage(req, res, next) {
  try {
    const travelPackage = await Package.findOne({ slug: req.params.slug }).lean();

    if (!travelPackage) {
      throw new ApiError(404, "Package not found");
    }

    const svg = buildOgSvg({
      eyebrow: "Khajuraho Tour Package",
      title: travelPackage.name,
      subtitle: `From Rs. ${travelPackage.price} • ${travelPackage.duration} • ${travelPackage.includedKm} km included`,
      accent: "#8e5a2a"
    });

    res.type("image/svg+xml").send(svg);
  } catch (error) {
    next(error);
  }
}

export function getPreviewOgImage(req, res) {
  const type = req.query.type === "package" ? "package" : "blog";
  const title = req.query.title || "Khajuraho Roads";
  const subtitle =
    req.query.subtitle ||
    (type === "package"
      ? "Khajuraho package preview"
      : "Khajuraho blog article preview");

  const svg = buildOgSvg({
    eyebrow: type === "package" ? "Khajuraho Tour Package" : "Khajuraho Travel Blog",
    title,
    subtitle,
    accent: type === "package" ? "#8e5a2a" : "#b56a34"
  });

  res.type("image/svg+xml").send(svg);
}
