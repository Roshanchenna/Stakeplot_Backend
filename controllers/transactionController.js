const summary = require("../models/summary");
const fiAccount = require("../models/fiAccount");
const transactions = require("../models/transactions");
const userProfile = require("../models/userProfile");


exports.createProfile = async (req, res) => {
    try {
        console.log('Received body:', JSON.stringify(req.body, null, 2));
        
        // Check if body is in the expected format
        const data = req.body.body ? req.body.body[0] : req.body[0];
        
        if (!data || !data.fiObjects) {
            return res.status(400).json({
                success: false,
                error: "Invalid request body structure"
            });
        }

        const fiObject = data.fiObjects[0];

        // 1. Create FIP record
        const fipData = {
            fipId: data.fipId,
            fipName: data.fipName,
            custId: data.custId,
            consentId: data.consentId,
            sessionId: data.sessionId,
            fiAccountInfo: data.fiAccountInfo
        };
        const fipRecord = await fiAccount.create(fipData);

        // 2. Create User Profile
        const holderData = fiObject.Profile.Holders.Holder;
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
        const profileRecord = await userProfile.create(userProfileData);

        // 3. Create Summary
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
            status: fiObject.Summary.status
        };
        const summaryRecord = await summary.create(summaryData);

        // 4. Create Transactions
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
            }))
        };
        const transactionsRecord = await transactions.Transactions.create(transactionsData);

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