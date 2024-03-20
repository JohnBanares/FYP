const express = require('express')
const {
  createReview,
  getReview,
  getUserReviews,
  deleteReview,
  updateUsernameReview
}=require('../contollers/reviewController')
const router = express.Router()


router.get('/',getReview)
router.post('/',createReview)
router.get('/:username',getUserReviews)
router.delete('/:reviewId',deleteReview)
router.put('/:username/:usernameCopy', updateUsernameReview)  

module.exports = router