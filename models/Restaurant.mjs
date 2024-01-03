import mongoose, { Schema, model } from "mongoose";

const schema = Schema({
  name: String,
  location: {
    coordinate: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    id: {
      type: Number,
      required: true,
    },
  },
  additionalLocationInfo: String,
  type: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default model("Restaurant", schema);
