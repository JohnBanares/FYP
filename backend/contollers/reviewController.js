const { Reviews} = require('../models/reviewModel')

const getReview = async (req, res) => {
    const reviews = await Reviews.find({}).sort({createdAt: -1})
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

const getUserReviews = async (req, res) => {
  const { username } = req.params;

  try {
    const reviews = await Reviews.find({ username });

    if (!reviews) {
      return res.status(404).json({ error: 'No such user reviews' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
    createReview,
    getReview,
    getUserReviews,
};