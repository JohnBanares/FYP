const express = require('express')
const {
  getUsers,
  getUser,
  checkUserName,
  createUser,
  updatePass,
  updateUsername,
  updateEmail,
  updateImage,
}=require('../contollers/userController')
const router = express.Router()

router.get('/', getUsers)
router.get('/:email', getUser)
router.get('/checkUsername/:username', checkUserName)
router.post('/',createUser)
router.put('/:username/update-pass/:newPass',updatePass)
router.put('/:username/update-username/:usernameCopy',updateUsername)
router.put('/:username/update-email/:emailCopy',updateEmail)
router.put('/:username/update-image',updateImage)


  

module.exports = router