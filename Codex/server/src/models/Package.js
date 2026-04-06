import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, trim: true, unique: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true, trim: true },
    includedKm: { type: Number, required: true },
    extraPerKm: { type: Number, required: true },
    description: { type: String, required: true, trim: true },
    heroImage: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    featured: { type: Boolean, default: true },
    bestSeller: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

packageSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  } else if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }

  next();
});

export default mongoose.model("Package", packageSchema);
