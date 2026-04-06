import slugify from "slugify";
import Car from "../models/Car.js";
import ApiError from "../utils/ApiError.js";

export async function getCars(req, res, next) {
  try {
    const { maxPrice, seating, type } = req.query;
    const query = {};

    if (maxPrice) {
      query.pricePerKm = { $lte: Number(maxPrice) };
    }

    if (seating) {
      query.seatingCapacity = { $gte: Number(seating) };
    }

    if (type) {
      query.type = type;
    }

    const cars = await Car.find(query).sort({ featured: -1, pricePerKm: 1 });
    res.json(cars);
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedCars(_req, res, next) {
  try {
    const cars = await Car.find({ featured: true }).limit(4);
    res.json(cars);
  } catch (error) {
    next(error);
  }
}

export async function getCarBySlug(req, res, next) {
  try {
    const car = await Car.findOne({ slug: req.params.slug });
    if (!car) {
      throw new ApiError(404, "Car not found");
    }
    res.json(car);
  } catch (error) {
    next(error);
  }
}

export async function createCar(req, res, next) {
  try {
    const payload = {
      ...req.body,
      slug: slugify(req.body.name, { lower: true, strict: true })
    };
    const car = await Car.create(payload);
    res.status(201).json(car);
  } catch (error) {
    next(error);
  }
}

export async function updateCar(req, res, next) {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(car);
  } catch (error) {
    next(error);
  }
}

export async function deleteCar(req, res, next) {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
