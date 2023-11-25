import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import users from "./routes/users.mjs";
import restaurants from "./routes/restaurants.mjs";
import items from "./routes/items.mjs";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5050;
const URL = process.env.DB_URL
const app = express();

app.use(cors());
app.use(express.json());

// Load the /posts routes
app.use("/users", users);
app.use("/restaurants", restaurants);
app.use("/items", items);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, async() => {
  try{
    await mongoose.connect(URL, { dbName:"foodslice", useNewUrlParser: true })
    console.log(`Server is running on port: ${PORT}`);
  }
  catch(e){
    console.error(e)
    process.exit(1)
  }
});