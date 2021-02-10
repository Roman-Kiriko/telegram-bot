require('dotenv').config()
const express = require('express')
const app = express()
const PORT = 3000
const mongoose = require('mongoose')
const morgan = require('morgan')
const userRouters = require('./routes/user')



app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use('/api', userRouters)

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((e) => console.log(e))

app.listen(PORT, () => {
    console.log(`Server has been started on port http://localhost:${PORT}`);
})  