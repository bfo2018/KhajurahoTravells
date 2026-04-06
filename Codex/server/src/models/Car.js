import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    seatingCapacity: { type: Number, required: true },
    ac: { type: Boolean, default: true },
    pricePerKm: { type: Number, required: true },
    minBookingKm: { type: Number, default: 40 },
    luggage: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    images: [{ type: String }],
    driverProfile: {
      name: { type: String, required: true },
      languages: [{ type: String }],
      experience: { type: String, required: true },
      videoUrl: { type: String, default: "" },
      bio: { type: String, required: true }
    },
    featured: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Car", carSchema);
