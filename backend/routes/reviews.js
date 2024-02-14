const express = require('express')
const {
  createReview,
  getReview
}=require('../contollers/reviewController')
const router = express.Router()


router.get('/',getReview)
router.post('/',createReview)
  

module.exports = router