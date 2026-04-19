import dotenv from "dotenv";

dotenv.config();

const HARDCODED_CLIENT_URL = "https://khajuraho-travells.vercel.app";
const HARDCODED_SITE_URL = "https://khajuraho-travells.vercel.app";
const HARDCODED_API_ORIGIN = "https://baton-pancreas-herself.ngrok-free.dev";
const HARDCODED_API_URL = `${HARDCODED_API_ORIGIN}/api`;

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/khajuraho-roads",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  clientUrl: HARDCODED_CLIENT_URL,
  siteUrl: HARDCODED_SITE_URL,
  apiOrigin: HARDCODED_API_ORIGIN,
  apiUrl: HARDCODED_API_URL,
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  aiProvider: (process.env.AI_PROVIDER || "openai").toLowerCase(),
  ollamaBaseUrl: (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, ""),
  ollamaModel: process.env.OLLAMA_MODEL || "qwen2.5",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-5.4-mini",
  defaultRatePerKm: Number(process.env.DEFAULT_RATE_PER_KM || 12),
  adminName: process.env.ADMIN_NAME || "Khajuraho Admin",
  adminEmail: process.env.ADMIN_EMAIL || "admin@khajurahoroads.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin@123",
  indexNowKey: process.env.INDEXNOW_KEY || "",
  indexNowEndpoint: process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow"
};
