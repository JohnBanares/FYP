const mongoose = require('mongoose')

const Schema = mongoose.Schema

const imageSchema = new Schema({
   username: {
    type: String,
    required: true
   },
   image: {
    type: String,
    required: false
   }
})

const Images = mongoose.model('Images', imageSchema);


module.exports = {Images};