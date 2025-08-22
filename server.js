import { app, server } from "./socket/socket.js";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./DB/Connection1.js";
import cookieParser from "cookie-parser";
import MessageRoutes from "./routes/messageRoutes.js";
import cors from "cors";

connectDB();
const PORT = process.env.PORT || 5000;
//middlewares
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
app.use(
  cors({
    origin: ["https://chatapp-dusky-delta.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", MessageRoutes);
app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});