const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const UserModel = require("../models/userModel");
const ConversationModel = require("../models/Conversation");
const messageModel = require("../models/messageModel");
const app = express();
const getUserByToken = require("../utils/getUserByToken");
const getConversation = require("../utils/getConversation");

// socket connect
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const onlineUsers = new Set();

io.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;
  console.log(token, "token");

  const user = await getUserByToken(token);

  //   join room
  socket.join(user?._id?.toString());
  onlineUsers?.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUsers));

  socket.on("messagePage", async (userId) => {
    const userDetails = await UserModel.findById(userId).select("-password");

    const data = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profilePic: userDetails?.profilePic,
      online: onlineUsers?.has(userId),
    };

    socket.emit("messageUser", data);

    // old messages
    const getConvMessages = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });
    socket.emit("message", getConvMessages?.messages || []);
  });

  //    new message
  socket.on("newMessage", async (data) => {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    if (!conversation) {
      conversation = await ConversationModel.create({
        sender: data?.sender,
        receiver: data?.receiver,
      });
    }

    const message = await messageModel?.create({
      text: data?.text,
      imageUrl: data?.imageUrl,
      videoUrl: data?.videoUrl,
      msgByUser: data?.msgByUserId,
    });

    if (message) {
      await ConversationModel.updateOne(
        { _id: conversation?._id },
        {
          $push: { messages: message?._id },
        }
      );

      const getUpdatedConversation = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      // send new message
      io.to(data?.sender).emit(
        "message",
        getUpdatedConversation?.messages || []
      );

      io.to(data?.receiver).emit(
        "message",
        getUpdatedConversation?.messages || []
      );

      // send conversation to frontend
      const sendConv = await getConversation(data?.sender);
      const receiverConv = await getConversation(data?.receiver);

      io.to(data?.sender).emit("conversation", sendConv || []);
      io.to(data?.receiver).emit("conversation", receiverConv || []);
    }
  });

  // side bar
  socket.on("sidebar", async (userId) => {
    console.log(userId, "userId");

    const conversation = await getConversation(userId);

    socket.emit("conversation", conversation);
  });

  // seen messages
  socket.on("seen", async (msgByUser) => {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: user?.Id, receiver: msgByUser },
        { sender: msgByUser, receiver: user?.Id },
      ],
    });

    const getMessages = conversation?.messages || [];

    await messageModel.updateMany(
      {
        _id: { $in: getMessages },
        msgByUser,
      },
      {
        $set: { seen: true },
      }
    );

    const sendConv = await getConversation(user?._id?.toString());
    const receiverConv = await getConversation(msgByUser);

    io.to(user?._id?.toString()).emit("conversation", sendConv || []);
    io.to(msgByUser).emit("conversation", receiverConv || []);
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(user?._id?.toString());
  });
});

module.exports = {
  app,
  server,
};
