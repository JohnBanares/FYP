const express = require('express')
const {
  createReview,
  getReview,
  getUserReviews,
  deleteReview,
  updateUsernameReview,
  updateReviewRating,
  updateReviewDesc,
  getUserReviewsByRestaurantName
}=require('../contollers/reviewController')
const router = express.Router()


router.get('/',getReview)
router.get('/get-reviews-restaurantName/:restaurantName',getUserReviewsByRestaurantName)
router.get('/:username',getUserReviews)
router.post('/',createReview)
router.delete('/:reviewId',deleteReview)
router.put('/:username/:usernameCopy', updateUsernameReview)  
router.put('/update-review-rating/:username/:restaurantName/:rating', updateReviewRating)  
router.put('/update-review-description/:username/:restaurantName/:description', updateReviewDesc)  

module.exports = router