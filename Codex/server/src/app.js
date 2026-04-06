import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { env } from "./config/env.js";
import {
  getIndexNowKeyFile,
  getRobots,
  getSitemap
} from "./controllers/seoController.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/media", express.static(path.join(process.cwd(), "..", "client", "public", "media")));
app.get("/robots.txt", getRobots);
app.get("/sitemap.xml", getSitemap);
app.get(`/${env.indexNowKey || "indexnow"}.txt`, getIndexNowKeyFile);
app.use("/api", router);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(errorMiddleware);

export default app;
