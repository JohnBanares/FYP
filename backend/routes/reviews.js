const express = require('express')
const {
  createReview,
  getReview,
  getUserReviews,
  deleteReview,
  updateUsernameReview,
  updateReviewRating,
  updateReviewDesc
}=require('../contollers/reviewController')
const router = express.Router()


router.get('/',getReview)
router.post('/',createReview)
router.get('/:username',getUserReviews)
router.delete('/:reviewId',deleteReview)
router.put('/:username/:usernameCopy', updateUsernameReview)  
router.put('/update-review-rating/:username/:restaurantName/:rating', updateReviewRating)  
router.put('/update-review-description/:username/:restaurantname/:description', updateReviewDesc)  

module.exports = router