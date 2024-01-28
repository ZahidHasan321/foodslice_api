import express from "express";
import User from "../models/User.mjs";
import Notification from "../models/notification.mjs";
const Notifications = express.Router();

Notifications.post("/", async (req, res) => {
  try {
    const { recipient, message, title } = req.body;

    const user = await User.findOne({ uid: recipient }, "_id");

    console.log(user);
    // Create a new notification instance
    const newNotification = new Notification({
      recipient: user._id,
      message,
      title,
    });

    // Save the notification to the database
    const savedNotification = await newNotification.save();

    res.status(201).json(savedNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

Notifications.get("/get-all-notifications", async (req, res) => {
  try {
    const { recipient } = req.query;

    const user = await User.findOne({ uid: recipient }, "_id");

    const savedNotifications = await Notification.find({ recipient: user?._id})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("recipient")
      .exec();

    res.status(200).json(savedNotifications);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default Notifications;
