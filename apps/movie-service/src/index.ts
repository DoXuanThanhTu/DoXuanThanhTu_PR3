import express from "express";
import dotenv from "dotenv";
import { connectDB } from "@repo/database";
import movieRoutes from "./routes/movie.route.js";
import episodeRoutes from "./routes/episode.route.js";
import serverRoutes from "./routes/server.routes.js";
import watchRoute from "./routes/watch.route.js";
import franchiseRoutes from "./routes/franchise.routes.js";
import cors from "cors";
dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"], // hoặc domain production nếu có
    credentials: true,
  })
);

app.use("/movies", movieRoutes);
app.use("/episodes", episodeRoutes);
app.use("/servers", serverRoutes);
app.use("/watch", watchRoute);
app.use("/franchise", franchiseRoutes);
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("🎬 Movie service connected to MongoDB");

    const PORT = process.env.PORT || 4002;
    app.listen(PORT, () => {
      console.log(`🚀 Movie service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start Movie service:", err);
    process.exit(1);
  }
};

startServer();
