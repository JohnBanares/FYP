const express = require('express')
const {
    updateImage
}=require('../contollers/imageController')
const router = express.Router()

router.post('/',updateImage)


module.exports = router