const {Restaurants} = require('../models/restaurantModel')

const  getRestaurant = async (req, res) => {
    const restaurants = await Restaurants.find({}).sort({createdAt: -1})
    res.status(200).json(restaurants)
}



module.exports = {
    getRestaurant,
};