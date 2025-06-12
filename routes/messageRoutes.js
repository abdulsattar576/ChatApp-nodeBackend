import express from "express";
 import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();
 router.post("/send/:receiverId",isAuthenticated,sendMessage)
  router.get("/get-messages/:otherParticipantId",isAuthenticated,getMessages)
 

export default router;