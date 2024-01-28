import express from "express";
import User from "../models/User.mjs";
import RestaurantReviews from "../models/RestaurantReviews.mjs";
import Restaurant from "../models/Restaurant.mjs";

const router = express.Router();

router.post("/post-review", async (req, res) => {
  const params = req.body;
  try {
    const user = await User.findOne({ uid: params.user }, "_id");
    params.user = user._id;
    const filter = { user: params.user, restaurant: params.restaurant }; // Use appropriate filter
    const update = { $set: params };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const insertedDocument = await RestaurantReviews.findOneAndUpdate(
      filter,
      update,
      options
    );

    await Restaurant.updateOne({_id: params.restaurant}, {$addToSet: {reviews: insertedDocument._id}}, {upsert: true})

    await Restaurant.updateAverageRating(params.restaurant);
    
    return res.status(201).json("Review submitted");
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-reviews-by-restaurant", async (req, res) => {
  try {
    const reviews = await RestaurantReviews.find({restaurant: req.query.restaurant}).populate("user").exec()
    res.status(201).send(reviews);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-reviews-of-restaurant", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.query.id }, "_id");
    const restaurantId = await Restaurant.findOne({ owner: user._id }, "_id");
    const reviews = await RestaurantReviews.find({restaurant: restaurantId._id}).populate("user").exec()
    res.status(201).send(reviews);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


export default router;
