const express = require('express')
const mongoose = require('mongoose')
// const cors = require('cors')
const reviewsRoutes = require('./routes/reviews')
const restaurantsRoutes = require('./routes/restaurant')
const usersRoutes = require('./routes/user')



const app = express()

app.use(express.json())
// app.use(cors());


app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
  })

//routes
app.use('/api/reviews', reviewsRoutes)
app.use('/api/restaurant', restaurantsRoutes)
app.use('/api/users', usersRoutes)



mongoose.connect('mongodb+srv://john:fypPass@fyp.prikpj5.mongodb.net/?retryWrites=true&w=majority')

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB Atlas');
});
  
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB Atlas: ', err);
});
//port
app.listen(3003, () =>{
    console.log('listening on port 3003')
})