const mongoose = require('mongoose');
const { Schema } = mongoose;

const summarySchema = new Schema({
    currency: {
        type: String,
        required: true,
        enum: ['INR'] // Assuming the only currency used is INR
    },
    exchangeRate: {
        type: String,
        default: '' // Optional and defaults to an empty string if not provided
    },
    balanceDateTime: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['SAVINGS', 'CURRENT', 'FIXED'] // Add other types if needed
    },
    branch: {
        type: String,
        required: true
    },
    facility: {
        type: String,
        required: true
    },
    ifscCode: {
        type: String,
        required: true
    },
    micrCode: {
        type: String,
        default: '' // Optional and defaults to an empty string if not provided
    },
    openingDate: {
        type: Date,
        required: true
    },
    currentODLimit: {
        type: Number,
        required: true
    },
    drawingLimit: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['ACTIVE', 'INACTIVE', 'CLOSED'] // Add other statuses if applicable
    }
});

module.exports = mongoose.model('Summary', summarySchema);
