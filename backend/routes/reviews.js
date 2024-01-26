const express = require('express')
const {
  createReview
}=require('../contollers/reviewController')
const router = express.Router()

router.get('/', (req,res) =>{
    res.json({mssg: 'Get all reviews'})
})

router.post('/',createReview)
  

module.exports = router