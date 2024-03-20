const express = require('express')
const {
  getUsers,
  getUser,
  checkUserName,
  createUser,
  updatePass,
  updateUsername
}=require('../contollers/userController')
const router = express.Router()

router.get('/', getUsers)
router.get('/:email', getUser)
router.get('/:username', checkUserName)
router.post('/',createUser)
router.put('/:username/:newPass',updatePass)
router.put('/:username/update-username/:usernameCopy',updateUsername)
  

module.exports = router