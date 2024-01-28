import express from "express";
import Chat from "../models/chat.mjs";

const Chats = express.Router();

Chats.get("/chat-history", async (req, res) => {
  try {

    const chat = await Chat.findOne({
      restaurant: req.query.restaurantId,
      customer: req.query.customerId,
    })

    const chatMessages = chat ? chat.messages : [];
    res.status(200).json(chatMessages);
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
  }
});

Chats.get("/get-chat-list", async(req, res) => {
  const param = req.query;

  try{
    const chatList = await Chat.find({restaurant: param.restaurantId}).populate('customer').populate({path:'restaurant', select: 'name coverImage'}).sort({ 'messages.timestamp': -1 }).exec()
    const chatMap = chatList.reduce((map, chat) => {
      map[chat.customer._id] = chat;
      return map;
    }, {});

    res.status(200).json(chatMap);
  }
  catch(error){
    console.log(error)
  }
})

export default Chats;
