import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import morgan from "morgan"
import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const moduleDir = path.dirname(__filename);
dotenv.config({ path: path.resolve(moduleDir, "../.env") });

const app=express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials:true
}))

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'))

app.use((err, _req, res, next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Maximum size is 10 MB." });
  }
  if (err?.message?.includes("Unsupported file type")) {
    return res.status(400).json({ error: err.message.replace(/^❌\s*/, "") });
  }
  if (err?.name === "MulterError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

export {app};