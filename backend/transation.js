const mongoose = require("mongoose");
const { Account } = require("./db");

const transferFunds = async (fromAccountId, toAccountId, amount) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        // Deduct money from sender
        await Account.findByIdAndUpdate(
            fromAccountId,
            {
                $inc: {
                    balance: -amount
                }
            },
            {
                session
            }
        );

        // Add money to receiver
        await Account.findByIdAndUpdate(
            toAccountId,
            {
                $inc: {
                    balance: amount
                }
            },
            {
                session
            }
        );

        await session.commitTransaction();

        console.log("Transaction successful");

    } catch (error) {

        await session.abortTransaction();

        console.log("Transaction failed", error);

        throw error;

    } finally {

        await session.endSession();

    }
};

module.exports = { transferFunds };