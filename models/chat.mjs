import mongoose, { Schema, model } from "mongoose";

const chatSchema = new Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User schema for customers
    required: true,
  },
  messages: [
    {
      sender: {
        type: String, // 'restaurant' or 'customer'
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Chat = model("Chat", chatSchema);

export default Chat;
