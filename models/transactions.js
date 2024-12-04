const mongoose = require('mongoose');
const { Schema } = mongoose;

// Reuse the transaction schema for individual transactions
const transactionSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['DEBIT', 'CREDIT'] // Assuming only these two types
    },
    mode: {
        type: String,
        required: true,
        enum: ['UPI', 'OTHERS', 'CASH', 'CHEQUE', 'NETBANKING'] // Expand based on all possible modes
    },
    amount: {
        type: Number,
        required: true
    },
    currentBalance: {
        type: String,
        required: true
    },
    transactionTimestamp: {
        type: Date,
        required: true
    },
    valueDate: {
        type: Date,
        required: true
    },
    txnId: {
        type: String,
        default: '' // Optional with default as empty string
    },
    narration: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        default: '' // Optional with default as empty string
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:"userProfile"
    }
});

// Schema for storing multiple transactions
const transactionsSchema = new Schema({
    accountId: {
        type: String,
        required: true
    },
    transactions: {
        type: [transactionSchema], // Array of transactionSchema
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Exporting the models
module.exports = {
    Transaction: mongoose.model('Transaction', transactionSchema),
    Transactions: mongoose.model('Transactions', transactionsSchema)
};
