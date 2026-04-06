import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/khajuraho-roads",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  siteUrl: process.env.SITE_URL || process.env.CLIENT_URL || "http://localhost:5173",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-5.4-mini",
  defaultRatePerKm: Number(process.env.DEFAULT_RATE_PER_KM || 12),
  adminName: process.env.ADMIN_NAME || "Khajuraho Admin",
  adminEmail: process.env.ADMIN_EMAIL || "admin@khajurahoroads.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin@123",
  indexNowKey: process.env.INDEXNOW_KEY || "",
  indexNowEndpoint: process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow"
};
