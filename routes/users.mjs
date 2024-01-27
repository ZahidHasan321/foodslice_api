import express from "express";
import User from "../models/User.mjs";
const router = express.Router();

// Get a list of 50 posts
router.post("/", async (req, res) => {
  const newUser = new User(req.body);
  const insertedUser = await newUser.save();
  return res.status(201).json(insertedUser);
});

router.get("/", async (req, res) => {
  const allUsers = await User.find();
  return res.status(200).json(allUsers);
});

router.get("/getUser/", async (req, res) => {
  const param = req.query;
  const user = await User.findOne({ uid: param.uid }).exec();
  return res.status(200).json(user);
});

router.post("/update-profile", async (req, res) => {
  const params = req.body;

  try {
    const insertedData =await User.findOneAndUpdate({uid: params.uid},{$set: {username:params.username, profilePicture: params.profilePicture}}, {upsert:true, new:true})

    res.status(200).json("Updated successfully")
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
