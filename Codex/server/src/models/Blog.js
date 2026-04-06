import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const blogSectionSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, trim: true, unique: true },
    excerpt: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    keywords: [{ type: String, trim: true }],
    heroImage: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published"
    },
    sections: [blogSectionSchema],
    publishedAt: { type: Date, default: Date.now },
    featured: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

blogSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  } else if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  next();
});

export default mongoose.model("Blog", blogSchema);
