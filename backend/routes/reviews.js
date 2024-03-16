const express = require('express')
const {
  createReview,
  getReview,
  getUserReviews,
  deleteReview
}=require('../contollers/reviewController')
const router = express.Router()


router.get('/',getReview)
router.post('/',createReview)
router.get('/:username',getUserReviews)
router.delete('/:reviewId',deleteReview)
  

module.exports = router