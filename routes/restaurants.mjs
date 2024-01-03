import express from "express";
import Restaurant from "../models/Restaurant.mjs";
import User from "../models/User.mjs";
const router = express.Router();

router.post("/register-restaurant", async (req, res) => {
  const newRestaurant = new Restaurant(req.body);
  const isFound = await Restaurant.exists({
    name: req.body.name,
    owner: req.body.owner,
  });

  if (isFound) {
    return res.status(201).json({ message: "Already exits" });
  } else {
    const insertedRestaurant = await newRestaurant.save();
    await User.findOneAndUpdate({_id: req.body.owner}, {isRegistered : true})
    return res.status(201).json(insertedRestaurant);
  }
});

router.get("/", async (req, res) => {
  const allRestaurants = await Restaurant.find().populate("owner");
  return res.status(200).json(allRestaurants);
});

router.get("/getRestaurantByUser/", async(req, res) => {
  const param = req.query
  
  const restaurant = await Restaurant.findOne({ owner: param.owner}).exec();
  return res.status(200).json(restaurant)
})

export default router;
