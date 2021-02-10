const mongoose = require("mongoose");
const Schema = mongoose.Schema


const userSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: String,
    location: {
        type: Object
    }
})

module.exports = mongoose.model('users', userSchema)