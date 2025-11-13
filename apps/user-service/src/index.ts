import { connectDB } from "@repo/database";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.routes.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
  })
);
connectDB();
// Kết nối DB trước khi khởi động server
// connectDatabase()
//   .then(() => {
//     console.log("✅ MongoDB connected");

//     // Route test
//     app.get("/users", async (req, res) => {
//       try {
//         const users = await UserModel.find().limit(10);
//         res.json(users);
//       } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Error fetching users", error: err });
//       }
//     });app.use(loggerMiddleware);
app.use(loggerMiddleware);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`🚀 User service running on port ${PORT}`));
// })
// .catch((err: any) => {
//   console.error("❌ Database connection failed:", err);
//   process.exit(1);
// });
