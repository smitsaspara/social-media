import express from "express";
import { forgotPassword, login, resetPassword } from "../controllers/auth.js";

const authRoutes = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);

export default authRoutes;