import mongoose, { Schema, model } from "mongoose";

const schema = Schema({
  name: String,
  price: Number,
  ingredients: String,
  description: String,
  category: String,
  available: {
    type: Boolean,
    default: true
  },
  img: {
    name: { type: String, required: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model("Item", schema);
