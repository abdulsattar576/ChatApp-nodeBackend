import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: [process.env.CLIENT_URL] } });
const userSocketMap={

}
io.on('connection',(socket)=>{
    const userId=socket.handshake.query.userId
    if(!userId)return;
     userSocketMap[userId]=socket.id
     io.emit('onlineUser',Object.keys(userSocketMap))
     //close connecttion
     socket.on('disconnect',()=>{
        delete userSocketMap[userId];
        io.emit('onlineUser',Object.keys(userSocketMap))
     })
})
//getSocketId
const getSocketId=(userId)=>{
   return userSocketMap[userId];
}
export {io,app,server,getSocketId}