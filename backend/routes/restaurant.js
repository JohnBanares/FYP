const express = require('express')
const {
  getRestaurant
}=require('../contollers/restaurantController')
const router = express.Router()

router.get('/', getRestaurant)
  

module.exports = router