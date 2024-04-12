const {Images} = require('../models/imageModel')

const updateImage = async(req,res) => {
    const {username, image} = req.body;
  
    try {
        const temp = await Images.create({username, image});
        console.log(temp);
        res.status(200).json(temp)  ;
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({error: error.message});
      }
}
module.exports = {
    updateImage,
}