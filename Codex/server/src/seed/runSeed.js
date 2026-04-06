import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import User from "../models/User.js";
import Car from "../models/Car.js";
import Package from "../models/Package.js";
import Booking from "../models/Booking.js";
import Blog from "../models/Blog.js";
import { blogSeedData, carSeedData, packageSeedData } from "../services/seedData.js";

async function runSeed() {
  await connectDatabase();
  await Promise.all([
    User.deleteMany({}),
    Car.deleteMany({}),
    Package.deleteMany({}),
    Blog.deleteMany({}),
    Booking.deleteMany({})
  ]);

  await Car.insertMany(carSeedData);
  await Package.insertMany(packageSeedData);
  await Blog.insertMany(blogSeedData);

  const password = await bcrypt.hash(env.adminPassword, 10);
  await User.create({
    name: env.adminName,
    email: env.adminEmail,
    phone: "+91 7483667939",
    password,
    role: "admin"
  });

  console.log("Seed complete");
  process.exit(0);
}

runSeed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
