import Conversation from "../models/ConversationModel.js";
import Message from "../models/MessageModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import {getSocketId, io} from '../socket/socket.js'
export const sendMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.user?._id;
  const receiverId = req.params.receiverId;
  const message = req.body.message;
   if (!senderId || !receiverId || !message) {
    return next(new errorHandler("All fields are required", 400));
  }
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }
  const newMessage = await Message.create({
    message,
    receiverId,
    senderId,
  });
  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await conversation.save();
  }
  //socket.io
 const socketId = getSocketId(receiverId)
if (socketId) {
  io.to(socketId).emit('newMessage', newMessage)
}

  res.status(200).json({
    success: true,
    responceData: {
      newMessage,
    },
  });
});
//getmessages
export const getMessages = asyncHandler(async (req, res, next) => {
  const myId = req.user?._id;
  const otherParticipantId = req.params.otherParticipantId;
   
   if (!myId || !otherParticipantId) {
    return next(new errorHandler("All fields are required", 400));
  }
  let conversation = await Conversation.findOne({
    participants: { $all: [myId, otherParticipantId] },
  }).populate("messages")
  res.status(200).json({
    success:true,
    responceData:conversation
  })
   
});