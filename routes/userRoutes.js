import express from "express";
import { getotherUsers, getProfile, login, Logout, register } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
//login
router.post("/login", login);

//register
router.post("/register",register)
//profile
router.get("/profile",isAuthenticated,getProfile)
//logout
router.post("/logout",isAuthenticated,Logout)
export default router;
//other users
router.get("/get-other-users",isAuthenticated,getotherUsers)