import mongoose from "mongoose";

const { Schema, model } = mongoose;

const notificationSchema = Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: {type: String, required: true},
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Notification = model('Notification', notificationSchema);

export default Notification;
