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

router.post("/", upload.single("image"), async (req, res, next) => {
  const isFound = await Item.exists({
    name: req.body.name,
    category: req.body.category,
    user: req.body.restaurant,
  });

  if (isFound) {
    res.status(201).json({ value: false, message: "item already exists" });
  } else {
    const item = new Item({
      ...req.body,
      img: {
        name: req.file.originalname,
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    item.save();
    res.status(200).json({ value: true, message: "Submitted successfully" });
  }
});

router.get("/", async (req, res) => {
  const allItems = await Item.find().populate({
    path: "restaurant",
    populate: {
      path: "owner",
    },
  });

  return res.status(200).json(allItems);
});

router.get("/getItems", async (req, res) => {
  User.findOne({ uid: req.query.id }, "_id").then((userId) => {
    Item.find({ restaurant: userId }).then((items) => {
      res.status(200).json(items);
    });
  });
});

router.get("/getItemById", async(req, res) => {
  Item.findOne({_id: req.query.id})
  .then(result => {
    res.status(200).json(result)
  })
  .catch(e => {
    res.status(201).json(e.message)
  }) 
})

router.delete("/deleteItem", async (req, res) => {
  Item.deleteOne({ _id: req.query.id })
    .then(() => {
      res.status(200).json({ value: true, message: "deleted" });
    })
    .catch(() => {
      res.status(201).json({ value: true, message: "Cannot delete" });
    });
});

router.put("/updateAvailability", async(req, res) => {
  Item.findOneAndUpdate({_id: req.body.id},{
    available: req.body.value
  })
  .then(() => {
    res.status(200).json({value:true, message:'updated'})
  })
  .catch((e) =>{
    res.status(201).json({value:false, message:'Update failed'})
  })
})

export default router;
