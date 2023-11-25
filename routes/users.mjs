import express from "express";
import User from "../models/User.mjs";
const router = express.Router();


// Get a list of 50 posts
router.post("/", async (req, res) => {
    console.log(req.body)
    const newUser = new User(req.body)
    const insertedUser = await newUser.save()
    return res.status(201).json(insertedUser)
});

router.get("/", async(req, res) => {
    const allUsers = await User.find();
    return res.status(200).json(allUsers)
})

router.get("/getUser/", async(req, res) => {
    const param = req.query
    const user = await User.findOne({ uid: param.uid}).exec();
    return res.status(200).json(user)
})

router.put("/updateReg", async (req, res) => {
    const updatedUser = await User.findOneAndUpdate({uid: req.body.uid}, {isRegistered : true})
    return res.status(200).json(updatedUser)
});

export default router;