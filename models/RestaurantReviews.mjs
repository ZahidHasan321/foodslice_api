import mongoose, { Schema, model } from "mongoose";
import Restaurant from "./Restaurant.mjs";

const reviewSchema = new Schema({
  comment: {
    type: String,
  },
  criteria: {
    service: {
      type: Number,
      min: 1,
      max: 5,
    },
    foodQuality: {
      type: Number,
      min: 1,
      max: 5,
    },
    ambiance: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.post('save', async function (doc) {

  try {
    await Restaurant.updateAverageRating(doc.restaurant);
  } catch (error) {
    console.error('Error updating average rating:', error);
  }
});

reviewSchema.virtual("overallRating").get(function () {
  const criteriaCount = Object.keys(this.criteria).length;
  const totalRating = Object.values(this.criteria).reduce(
    (sum, rating) => sum + rating,
    0
  );
  return criteriaCount === 0 ? null : totalRating / criteriaCount;
});

reviewSchema.set("toJSON", { virtuals: true });

const RestaurantReviews = model("RestaurantReviews", reviewSchema);
export default RestaurantReviews;
