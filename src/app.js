require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose') 
const userRouters = require('./routes/user')



app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use('/api', userRouters)

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((e) => console.log(e))

app.listen(PORT)