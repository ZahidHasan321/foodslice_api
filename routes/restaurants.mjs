import express from "express";
import Restaurant from "../models/Restaurant.mjs";
import User from "../models/User.mjs";
const router = express.Router();

router.post("/register-restaurant", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.body.owner });

    const isFound = await Restaurant.exists({
      name: req.body.name,
      owner: user._id,
    });

    if (isFound) {
      return res.status(201).json({ message: "Already exists" });
    } else {
      console.log(user);
      const newRestaurant = new Restaurant({
        ...req.body,
        owner: user._id.toString(),
      });
      const insertedRestaurant = await newRestaurant.save();
      await User.findOneAndUpdate({ _id: user._id }, { isRegistered: true });
      return res.status(201).json(insertedRestaurant);
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-all-restaurants", async (req, res) => {
  const allRestaurants = await Restaurant.find();
  return res.status(200).json(allRestaurants);
});

router.get("/get-restaurant-by-type", async (req, res) => {
  try {
    const typedRestaurants = await Restaurant.aggregate([
      { $match: { type: req.query.type } },
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          coverImage: 1,
          type: 1,
          averageRating: 1,
          numberOfReviews: { $size: { $ifNull: ["$reviews", []] } },
        },
      },
    ]);

    console.log(typedRestaurants);

    res.status(200).json(typedRestaurants);
  } catch (error) {
    console.error("Error retrieving restaurants:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-top-restaurants", async (req, res) => {
  try {
    const topRestaurants = await Restaurant.aggregate([
      {
        $group: {
          _id: "$type",
          restaurants: {
            $push: {
              _id: "$_id",
              name: "$name",
              location: "$location",
              type: "$type",
              coverImage: "$coverImage",
              averageRating: "$averageRating",
              numberOfReviews: {
                $size: { $ifNull: ["$reviews", []] }, // Use $ifNull to handle undefined reviews
              },
            },
          },
        },
      },
      {
        $project: {
          type: "$_id",
          restaurants: {
            $slice: ["$restaurants", 10], // Take only the top 10
          },
        },
      },
      {
        $unwind: "$restaurants",
      },
      {
        $replaceRoot: { newRoot: "$restaurants" },
      },
      {
        $sort: { averageRating: -1 }, // Sort by averageRating in descending order
      },
    ]);

    return res.status(200).json(topRestaurants);
  } catch (error) {
    console.error("Error retrieving top restaurants:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-restaurant-id", async (req, res) => {
  try {
    const userId = await User.findOne({ uid: req.query.uid }, "_id");
    const restaurantId = await Restaurant.findOne({ owner: userId._id }, "_id");
    return res.status(200).json(restaurantId);
  } catch (error) {
    console.log(error);
  }
});

router.get("/getRestaurantByUser", async (req, res) => {
  const param = req.query;

  const restaurant = await Restaurant.findOne({ owner: param.owner }).exec();
  return res.status(200).json(restaurant);
});

export default router;
