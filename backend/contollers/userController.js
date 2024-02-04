const { Users} = require('../models/userModel')

const getUsers = async (req, res) => {
  const users = await Users.find({}).sort({createdAt: -1})
  res.status(200).json(users)
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

module.exports = {
  getUsers,  
  createUser,
};