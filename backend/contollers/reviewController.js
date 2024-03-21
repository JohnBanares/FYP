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

const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  Reviews.findByIdAndDelete(reviewId)
    .then(result => {
      if (result) {
        console.log(`Review with ID ${reviewId} has been deleted.`);
        res.status(200).json({ message: "Review deleted successfully" });
      } else {
        console.log(`No goal found with ID ${reviewId}.`);
        res.status(404).json({ error: "Goal not found" });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
}

const updateUsernameReview = async (req, res) => {
  const { username, usernameCopy } = req.params;

  Reviews.updateMany({ username}, { username: usernameCopy })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Username updated successfully" });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

const updateReviewRating = async (req, res) => {
  const { username, restaurantName, rating } = req.params;

  Reviews.findOneAndUpdate({ username, restaurantName}, { rating: rating })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Review rating updated successfully" });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

const updateReviewDesc = async (req, res) => {
  const { username, restaurantName, description } = req.params;

  Reviews.findOneAndUpdate({ username, restaurantName}, { description: description })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Review description updated successfully" });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

module.exports = {
    createReview,
    getReview,
    getUserReviews,
    deleteReview,
    updateUsernameReview,
    updateReviewRating,
    updateReviewDesc,
};