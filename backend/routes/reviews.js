const express = require('express')
const {
  createReview,
  getReview,
  getUserReviews
}=require('../contollers/reviewController')
const router = express.Router()


router.get('/',getReview)
router.post('/',createReview)
router.get('/:username',getUserReviews)
  

module.exports = router