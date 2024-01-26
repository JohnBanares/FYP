const mongoose = require('mongoose')

const Schema = mongoose.Schema

const restaurantSchema = new Schema({
   restaurantName: {
    type: String,
    required: true
   },
   restaurantType:{
      type: String,
      required: true
   },
   rating: {
    type:Number,
    required: true
   }
})

const Restaurants = mongoose.model('Restaurants', restaurantSchema);


module.exports = {Restaurants};