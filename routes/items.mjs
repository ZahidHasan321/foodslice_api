import express, { query } from "express";
import Item from "../models/Item.mjs";
import Restaurant from "../models/Restaurant.mjs";
import User from "../models/User.mjs";
const router = express.Router();
import multer from "multer";

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
  const restaurant = await Restaurant.findOne({owner: req.body.restaurant}, '_id name')

  if (!restaurant) {
    // Handle the case where no restaurant is found
    res.status(404).json({ error: "Restaurant not found" });
    return;
  }
  try {
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

export default router;
