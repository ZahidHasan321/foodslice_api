import express from "express";
import Restaurant from "../models/Restaurant.mjs";
const router = express.Router();

router.post("/", async (req, res) => {
  console.log(req.body);
  const newRestaurant = new Restaurant(req.body);
  const isFound = await Restaurant.exists({
    name: req.body.name,
    location: req.body.location,
  });

  if (isFound) {
    return res.status(201).json({ message: "Already exits" });
  } else {
    const insertedRestaurant = await newRestaurant.save();
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
