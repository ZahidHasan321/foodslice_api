import mongoose, { Schema, model } from "mongoose";
import RestaurantReviews from "./RestaurantReviews.mjs";

const restaurantSchema = Schema({
  name: String,
  location: {
    coordinate: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    id: {
      type: Number,
      required: true,
    },
  },
  coverImage: String,
  additionalLocationInfo: String,
  type: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RestaurantReviews',
    },
  ],
});

restaurantSchema.statics.updateAverageRating = async function (restaurantId) {

  try {
    const reviews = await RestaurantReviews.find({ restaurant: new mongoose.Types.ObjectId(restaurantId) });
    console.log('Reviews:', reviews);

    const totalCriteria = { service: 0, foodQuality: 0, ambiance: 0 };

    reviews.forEach((review) => {
      totalCriteria.service += review.criteria.service;
      totalCriteria.foodQuality += review.criteria.foodQuality;
      totalCriteria.ambiance += review.criteria.ambiance;
    });

    const totalOverallRating = (totalCriteria.service + totalCriteria.foodQuality + totalCriteria.ambiance) / (reviews.length * 3);

    console.log('totalOverallRating:', totalOverallRating);

    await this.findByIdAndUpdate(restaurantId, { averageRating: totalOverallRating });
  } catch (error) {
    console.error('Error updating average rating:', error);
  }
};



export default model("Restaurant", restaurantSchema);
