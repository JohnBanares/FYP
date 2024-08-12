const { Users} = require('../models/userModel')
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
    // await Images.create({ username: username, image: filename });
    let user = await Users.findOne({ username: username });

    const oldImagePath = path.join('files', username, user.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

    user.image = filename;
    await user.save();

    return res.send({ status: 'ok' });
  }catch(e){
    console.error('Error fetching user:', e);
    return res.status(500).json({ e: 'Internal Server Error' });
  }
  })
}

const getUsers = async (req, res) => {
  const users = await Users.find({}).sort({createdAt: -1})
  res.status(200).json(users)
}

const getUser = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'No such user' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
const checkUserName = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'No such user' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const createUser = async (req, res) => {
    const {username, firstName, lastName, email, password} = req.body
    // console.log({username, rating, description});
    try {
      const review = await Users.create({username, firstName, lastName, email, password});
      console.log(review);
      res.status(200).json(review)  ;
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({error: error.message});
    }
}

const updatePass = async (req, res) => {
  const { username, newPass } = req.params;

  Users.findOneAndUpdate({ username}, { password: newPass })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Password updated successfully" });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

const updateUsername = async (req, res) => {
  const { username, usernameCopy } = req.params;

  Users.findOneAndUpdate({ username}, { username: usernameCopy })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Username updated successfully" });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

const updateEmail = async (req, res) => {
  const { username, emailCopy } = req.params;

  Users.findOneAndUpdate({ username}, { email: emailCopy })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Email updated successfully" });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

// const updateImage = async(req,res) => {
//   const {username, image} = req.params;

//   Users.findOneAndUpdate({ username}, { image: image })
//   .then(result => {
//     console.log(result);
//     res.status(200).json({ message: "photo updated successfully" });
//   })
//   .catch(error => {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   });
// }
module.exports = {
  getUsers,  
  getUser,
  checkUserName,
  createUser,
  updatePass,
  updateUsername,
  updateEmail,
  updateImage,
};