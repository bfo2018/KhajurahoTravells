import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import Package from "../models/Package.js";
import { calculatePrice, estimateDistanceKm } from "../services/pricingService.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

function generateBookingNumber() {
  return `KR-${Date.now().toString().slice(-8)}`;
}

export async function estimateDistance(req, res, next) {
  try {
    const { pickup, drop } = req.query;
    const estimatedDistanceKm = estimateDistanceKm(pickup || "", drop || "");
    res.json({ estimatedDistanceKm });
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req, res, next) {
  try {
    const {
      carId,
      packageId,
      pickupLocation,
      dropLocation,
      travelDate,
      travelTime,
      customer,
      distanceKm,
      tripType,
      notes,
      bookingType = "CAR",
      extraKm = 0
    } = req.body;

    if (bookingType === "CAR" && (!carId || !mongoose.Types.ObjectId.isValid(carId))) {
      throw new ApiError(400, "Please select a valid car");
    }

    if (bookingType === "PACKAGE" && (!packageId || !mongoose.Types.ObjectId.isValid(packageId))) {
      throw new ApiError(400, "Please select a valid package");
    }

    if (!pickupLocation?.trim() || !dropLocation?.trim()) {
      throw new ApiError(400, "Pickup and drop locations are required");
    }

    if (!travelDate || !travelTime) {
      throw new ApiError(400, "Travel date and time are required");
    }

    if (!customer?.name?.trim() || !customer?.email?.trim() || !customer?.phone?.trim()) {
      throw new ApiError(400, "Customer name, email, and phone are required");
    }

    let car = null;
    let travelPackage = null;
    let resolvedDistanceKm = 0;
    let billableKm = 0;
    let totalPrice = 0;
    let pricePerKm = 0;
    let includedKm = 0;
    let normalizedExtraKm = Math.max(Number(extraKm) || 0, 0);
    let packageName = "";

    if (bookingType === "CAR") {
      car = await Car.findById(carId);
      if (!car) {
        throw new ApiError(404, "Selected car not found");
      }

      const parsedDistance = Number(distanceKm);
      resolvedDistanceKm =
        (Number.isFinite(parsedDistance) && parsedDistance > 0 ? parsedDistance : null) ||
        estimateDistanceKm(pickupLocation, dropLocation);

      if (!resolvedDistanceKm) {
        throw new ApiError(
          400,
          "Distance could not be estimated for this route. Please enter distance in KM manually."
        );
      }

      const calculated = calculatePrice({
        distanceKm: resolvedDistanceKm,
        pricePerKm: car.pricePerKm,
        minBookingKm: car.minBookingKm
      });

      billableKm = calculated.billableKm;
      totalPrice = calculated.totalPrice;
      pricePerKm = car.pricePerKm;
    } else {
      travelPackage = await Package.findById(packageId);
      if (!travelPackage) {
        throw new ApiError(404, "Selected package not found");
      }

      includedKm = travelPackage.includedKm;
      packageName = travelPackage.name;
      pricePerKm = travelPackage.extraPerKm;
      resolvedDistanceKm = includedKm + normalizedExtraKm;
      billableKm = resolvedDistanceKm;
      totalPrice = travelPackage.price + normalizedExtraKm * travelPackage.extraPerKm;
    }

    const booking = await Booking.create({
      bookingNumber: generateBookingNumber(),
      customer,
      userId: req.user?._id || null,
      car: car?._id || null,
      package: travelPackage?._id || null,
      pickupLocation,
      dropLocation,
      travelDate,
      travelTime,
      distanceKm: resolvedDistanceKm,
      pricePerKm,
      totalPrice,
      tripType,
      notes,
      billableKm,
      bookingType,
      packageName,
      includedKm,
      extraKm: normalizedExtraKm
    });

    const populatedBooking = await Booking.findById(booking._id).populate("car package");
    res.status(201).json(populatedBooking);
  } catch (error) {
    next(error);
  }
}

export async function getBookings(req, res, next) {
  try {
    const query = req.user.role === "admin" ? {} : { userId: req.user._id };
    const bookings = await Booking.find(query).populate("car package").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

export async function getBookingsByUserId(req, res, next) {
  try {
    if (req.user.role !== "admin" && String(req.user._id) !== req.params.userId) {
      throw new ApiError(403, "You can only view your own bookings");
    }

    const bookings = await Booking.find({ userId: req.params.userId })
      .populate("car package")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

export async function getBookingById(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id).populate("car package");
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }
    res.json(booking);
  } catch (error) {
    next(error);
  }
}

export async function updateBookingStatus(req, res, next) {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate("car package");
    res.json(booking);
  } catch (error) {
    next(error);
  }
}
