const mongoose = require('mongoose');
const { Schema } = mongoose;

const fiAccountInfoSchema = new Schema({
    accountRefNo: {
        type: String,
        required: true
    },
    linkRefNo: {
        type: String,
        required: true
    }
});
    
const fipSchema = new Schema({
    fipId: {
        type: String,
        required: true
    },
    fipName: {
        type: String,
        required: true
    },
    custId: {
        type: String,
        required: true
    },
    consentId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    fiAccountInfo: {
        type: [fiAccountInfoSchema],
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:"userProfile"
    }
});

module.exports = mongoose.model('FIP', fipSchema);
