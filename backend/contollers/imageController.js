const {Images} = require('../models/imageModel')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { username } = req.params;
    const uploadDir = path.join('files', username);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
})

const upload = multer({ storage: storage }).single('file');

const updateImage = async(req,res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

  const filename = req.file.filename;
  const { username } = req.params;
  try{
    await Images.create({ username: username, image: filename });
    return res.send({ status: 'ok' });
  }catch(e){
    console.error('Error fetching user:', e);
    return res.status(500).json({ e: 'Internal Server Error' });
  }
  })
}
module.exports = {
    updateImage,
}