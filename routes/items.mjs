import express from "express";
import mongoose from 'mongoose';
import multer from "multer";
import Item from "../models/Item.mjs";
import Restaurant from "../models/Restaurant.mjs";
import User from "../models/User.mjs";
import RestaurantReviews from "../models/RestaurantReviews.mjs";

const router = express.Router();

// router.post("/", async (req, res) => {
//   const params = req.body;
//   const newItem = new Item(req.body);
//   const isFound = await Item.exists({
//     name: req.body.name,
//     category: req.body.category,
//     restaurant: req.body.restaurant,
//   });

//   if (isFound) {
//     return res.status(201).json({ message: "Already exits" });
//   } else {
//     const insertedItem = await newItem({
//       name: params.name,
//       ingredients: params.ingredients,
//       description: params.description,
//       price: params.price,
//       category: params.category,
//       img: { data: params.image, contentType: "image/jpeg" },
//     });
//     insertedItem.save()
//     return res.status(200).json(insertedItem);
//   }
// });

const upload = multer();

router.post("/post-item", async (req, res, next) => {
  try {
    const user = await User.findOne({uid: req.body.restaurant})
    const restaurant = await Restaurant.findOne({owner: user._id}, '_id name')

    if (!restaurant) {
      // Handle the case where no restaurant is found
      res.status(404).json({ error: "Restaurant not found" });
      return;
    }

    const isFound = await Item.exists({
      name: req.body.name,
      category: req.body.category,
      restaurant: restaurant._id,
    });

    if (isFound) {
      res.status(201).json({value: false, message:"item already exists"});
    } else {
     
      const item = new Item({...req.body, restaurant: restaurant._id});
      await item.save();
      res.status(200).json({value: true, message:"Submitted successfully"});
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const allItems = await Item.find().populate({
      path: "restaurant",
      populate: {
        path: "owner",
      },
    });
    res.status(200).json(allItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getItems", async (req, res) => {
  try {
    const userId = await User.findOne({ uid: req.query.id }, "_id");
    const restaurant = await Restaurant.findOne({owner: userId}, "_id")
    const items = await Item.find({ restaurant: restaurant });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getItemById", async (req, res) => {
  try {
    const result = await Item.findOne({ _id: req.query.id });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteItem", async (req, res) => {
  try {
    await Item.deleteOne({ _id: req.query.id });
    res.status(200).json({ value: true, message: "deleted" });
  } catch (error) {
    res.status(500).json({ value: false, message: "Cannot delete" });
  }
});

router.put("/updateAvailability", async (req, res) => {
  try {
    await Item.findOneAndUpdate(
      { _id: req.body.id },
      {
        available: req.body.value,
      }
    );
    res.status(200).json({ value: true, message: "updated" });
  } catch (error) {
    res.status(500).json({ value: false, message: "Update failed" });
  }
});

router.post("/update-item", async (req, res) => {
  const id = req.body._id;
  const updatedData = req.body;

  console.log(req.body)

  try {
    const result = await Item.findByIdAndUpdate(
      id,
      {
        name: updatedData.name,
        price: updatedData.price,
        ingredients: updatedData.ingredients,
        description: updatedData.description,
        category: updatedData.category,
        image: updatedData.image,
      },
      {new: true}
    );

    if (result) {
      res.json({
        message: "Document updated successfully",
        updatedDocument: result,
      });
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating document", error: error.message });
  }
});


router.get('/get-items-by-restaurant', async (req, res) => {
  try {
    const restaurantId = req.query['restaurant'];
    const items = await Item.find({ 'restaurant': new mongoose.Types.ObjectId(restaurantId.restaurantId) });
    const restaurant = await Restaurant.findOne({_id: new mongoose.Types.ObjectId(restaurantId.restaurantId)})
    const myReview = await RestaurantReviews.findOne({restaurant: restaurantId.restaurantId})
    const user = await User.findOne({uid: req.query.user}, '_id')
    res.json({restaurant, items, myReview, user});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
