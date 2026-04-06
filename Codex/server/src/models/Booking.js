import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      default: null
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      default: null
    },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    travelDate: { type: String, required: true },
    travelTime: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    billableKm: { type: Number, required: true },
    pricePerKm: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    bookingType: {
      type: String,
      enum: ["CAR", "PACKAGE"],
      default: "CAR",
      required: true
    },
    packageName: { type: String, default: "" },
    includedKm: { type: Number, default: 0 },
    extraKm: { type: Number, default: 0 },
    tripType: {
      type: String,
      enum: ["local", "outstation", "airport"],
      required: true
    },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Booking", bookingSchema);
