const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reviewSchema = new Schema({
   username: {
    type: String,
    required: true
   },
   restaurantName: {
      type:String,
      required: true
   },
   rating: {
    type:Number,
    required: true
   },
   description: {
    type: String,
    required: true
   },
   image: {
      type: String,
      default: 'stock.png' 
   }
})

const Reviews = mongoose.model('Reviews', reviewSchema);


module.exports = {Reviews};