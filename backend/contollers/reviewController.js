const { Reviews} = require('../models/reviewModel')

const getReview = async (req, res) => {
    const reviews = await Review.find({}).sort({createdAt: -1})
    res.status(200).json(reviews)
}

const createReview = async (req, res) => {
    const {username, restaurantName ,rating, description} = req.body
    // console.log({username, rating, description});
    try {
      const review = await Reviews.create({username, restaurantName, rating, description});
      console.log(review);
      res.status(200).json(review)  ;
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(400).json({error: error.message});
    }
}

module.exports = {
    createReview,
};