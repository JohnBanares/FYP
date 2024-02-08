const express = require('express')
const {
  getUsers,
  getUser,
  createUser
}=require('../contollers/userController')
const router = express.Router()

router.get('/', getUsers)
router.get('/:email', getUser)

router.post('/',createUser)
  

module.exports = router