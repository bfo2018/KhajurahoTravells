import Package from "../models/Package.js";
import { submitIndexNowUrls } from "../services/indexNowService.js";
import { env } from "../config/env.js";
import { slugify } from "../utils/slugify.js";
import ApiError from "../utils/ApiError.js";

export async function getPackages(_req, res, next) {
  try {
    const packages = await Package.find().sort({ bestSeller: -1, price: 1 });
    await Promise.all(
      packages
        .filter((travelPackage) => !travelPackage.slug)
        .map((travelPackage) => {
          travelPackage.slug = slugify(travelPackage.name);
          return travelPackage.save();
        })
    );
    res.json(packages);
  } catch (error) {
    next(error);
  }
}

export async function getPackageBySlug(req, res, next) {
  try {
    let travelPackage = await Package.findOne({ slug: req.params.slug });

    if (!travelPackage) {
      travelPackage = await Package.findOne({ name: new RegExp(`^${req.params.slug.replace(/-/g, "[-\\s]")}$`, "i") });
      if (travelPackage && !travelPackage.slug) {
        travelPackage.slug = slugify(travelPackage.name);
        await travelPackage.save();
      }
    }

    if (!travelPackage) {
      throw new ApiError(404, "Package not found");
    }

    res.json(travelPackage);
  } catch (error) {
    next(error);
  }
}

export async function createPackage(req, res, next) {
  try {
    const travelPackage = await Package.create(req.body);
    await submitIndexNowUrls([
      `${env.siteUrl}/packages`,
      `${env.siteUrl}/packages/${travelPackage.slug}`
    ]).catch(() => null);
    res.status(201).json(travelPackage);
  } catch (error) {
    next(error);
  }
}

export async function updatePackage(req, res, next) {
  try {
    const travelPackage = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (travelPackage) {
      await submitIndexNowUrls([
        `${env.siteUrl}/packages`,
        `${env.siteUrl}/packages/${travelPackage.slug}`
      ]).catch(() => null);
    }
    res.json(travelPackage);
  } catch (error) {
    next(error);
  }
}

export async function deletePackage(req, res, next) {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
    if (deletedPackage) {
      await submitIndexNowUrls([`${env.siteUrl}/packages`]).catch(() => null);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
