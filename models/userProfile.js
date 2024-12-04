const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');
const { Schema } = mongoose;

const userProfileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    nominee: {
        type: String,
    },
    landline: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pan: {
        type: String,
        required: true
    },
    ckyccompliance: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('UserProfile', userProfileSchema);
