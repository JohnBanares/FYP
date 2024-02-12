const express = require('express')
const {
  getUsers,
  getUser,
  checkUserName,
  createUser
}=require('../contollers/userController')
const router = express.Router()

router.get('/', getUsers)
router.get('/:email', getUser)
router.get('/:username', checkUserName)
router.post('/',createUser)
  

module.exports = router