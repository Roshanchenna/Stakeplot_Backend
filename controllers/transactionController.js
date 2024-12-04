const summary = require("../models/summary");
const fiAccount = require("../models/fiAccount");
const transactions = require("../models/transactions");
const userProfile = require("../models/userProfile");


exports.createProfile = async (req, res) => {
    try {
        const data = req.body.body[0]; // Access the first element of the body array
        const fiObject = data.fiObjects[0]; // Access the first FI object

        const holderData = fiObject.Profile.Holders.Holder;

        // Check if user already exists based on mobile number
        let profileRecord = await userProfile.findOne({ mobile: holderData.mobile });
        if(profileRecord){
            return res.json({
                message: "Already existing user"
            })
        }
        if (!profileRecord) {
            // Create User Profile if it doesn't exist
            const userProfileData = {
                name: holderData.name,
                dob: new Date(holderData.dob),
                mobile: holderData.mobile,
                nominee: holderData.nominee,
                landline: holderData.landline,
                address: holderData.address,
                email: holderData.email,
                pan: holderData.pan,
                ckyccompliance: holderData.ckycCompliance
            };
            profileRecord = await userProfile.create(userProfileData);
        }

        // 1. Create FIP record
        const fipData = {
            fipId: data.fipId,
            fipName: data.fipName,
            custId: data.custId,
            consentId: data.consentId,
            sessionId: data.sessionId,
            fiAccountInfo: data.fiAccountInfo,
            userId: profileRecord._id // Reference to userProfile
        };
        const fipRecord = await fiAccount.create(fipData);

        // 2. Create Summary
        const summaryData = {
            currency: fiObject.Summary.currency,
            exchangeRate: fiObject.Summary.exchgeRate,
            balanceDateTime: new Date(fiObject.Summary.balanceDateTime),
            type: fiObject.Summary.type,
            branch: fiObject.Summary.branch,
            facility: fiObject.Summary.facility,
            ifscCode: fiObject.Summary.ifscCode,
            micrCode: fiObject.Summary.micrCode,
            openingDate: new Date(fiObject.Summary.openingDate),
            currentODLimit: parseFloat(fiObject.Summary.currentODLimit),
            drawingLimit: parseFloat(fiObject.Summary.drawingLimit),
            status: fiObject.Summary.status,
            userId: profileRecord._id // Reference to userProfile
        };
        const summaryRecord = await summary.create(summaryData);

        // 3. Create or Append Transactions
        const transactionsData = {
            accountId: data.fiAccountInfo[0].accountRefNo,
            transactions: fiObject.Transactions.Transaction.map(t => ({
                type: t.type,
                mode: t.mode,
                amount: t.amount,
                currentBalance: t.currentBalance,
                transactionTimestamp: new Date(t.transactionTimestamp),
                valueDate: new Date(t.valueDate),
                txnId: t.txnId,
                narration: t.narration,
                reference: t.reference
            })),
            userId: profileRecord._id // Reference to userProfile
        };

        let transactionsRecord = await transactions.Transactions.findOne({ accountId: transactionsData.accountId });
        if (transactionsRecord) {
            // Append new transactions
            transactionsRecord.transactions.push(...transactionsData.transactions);
            await transactionsRecord.save();
        } else {
            // Create new transactions record
            transactionsRecord = await transactions.Transactions.create(transactionsData);
        }

        res.status(201).json({
            success: true,
            data: {
                fip: fipRecord,
                profile: profileRecord,
                summary: summaryRecord,
                transactions: transactionsRecord
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
