const express = require("express");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const mongoose = require("mongoose");
const JWT_SECRET = require("../config");
// const { transferFunds } = require("../transaction");
const { authMiddleware } = require("../middleware");
const { signupSchema, signinSchema, updateBody, transferSchema } = require("../types");
const bcrypt = require("bcrypt");
const router = express.Router();

console.log("USER ROUTER LOADED ")

router.post("/signup", async (req, res) => {

    try {

        const { success } = signupSchema.safeParse(req.body);

        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            });
        }

        const user = await User.findOne({
            username: req.body.username
        });

        if (user) {
            return res.status(411).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            req.body.password,
            10);

        const dbUser = await User.create(
            {
                username: req.body.username,
                password: hashedPassword,
                firstname: req.body.firstname,
                lastname: req.body.lastname
            }
        );

        await Account.create({
            userId: dbUser._id,
            balance: 0
        });

        const token = jwt.sign({
            userId: dbUser._id
        }, JWT_SECRET);

        res.json({
            message: "User created successfully",
            token: token
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "internal server error"
        });

    }

});


router.post("/signin", async (req, res) => {

    try {

        const { success } = signinSchema.safeParse(req.body);

        if (!success) {
            return res.status(411).json({
                message: "inccorrect inputs"
            })
        }

        const user = await User.findOne({
            username: req.body.username,

        })

        if (!user) {
            return res.status(411).json({
                message: "User not found"
            })
        }

        const passwordMatch = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(411).json({
                message: "incorrect usernname or password"
            })
        };

        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            message: "User signed in successfully",
            token: token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            {
                firstname: {
                    $regex: filter,
                    $options: "i"
                }
            },
            {
                lastname: {
                    $regex: filter,
                    $options: "i"
                }
            }
        ]
    });

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    });
});

router.put("/", authMiddleware, async (req, res) => {
    try {
        const { success } = updateBody.safeParse(req.body);

        if (!success) {
            return res.status(411).json({
                message: "Error while updating information"
            });
        }

        await User.updateOne(
            {
                _id: req.userId
            },
            req.body
        );

        res.json({
            message: "Updated successfully"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { to, amount } = req.body;

        const { success } = transferSchema.safeParse(req.body);

        if (!success) {

            await session.abortTransaction();

            return res.status(400).json({
                message: "Invalid transfer input"
            });
        }

        const account = await Account.findOne({
            userId: req.userId
        }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const receiver = await Account.findOne({
            userId: to
        }).session(session);


        if (!receiver) {

            await session.abortTransaction();

            return res.status(400).json({
                message: "receiver account not found "
            })
        }


        if (req.userId === to) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Cannot transfer money to yourself"
            });
        }

        // NEXT: deduct sender's balance
        const senderUpdate = await Account.updateOne(
            {
                userId: req.userId
            },
            {
                $inc: {
                    balance: -amount
                }
            },
            {
                session
            }
        );

        console.log("SENDER UPDATE:", senderUpdate);


        const receiverUpdate = await Account.updateOne(
            {
                userId: to
            },
            {
                $inc: {
                    balance: amount
                }
            },
            {
                session
            }
        );

        console.log("RECEIVER UPDATE:", receiverUpdate);

        await session.commitTransaction();

        res.json({
            message: "Transfer successfull "
        })
    } catch (err) {

        await session.abortTransaction();

        res.status(500).json({
            messaage: "transfer failed"
        });

        // we'll handle this next
    } finally {
        session.endSession();
    }
});
module.exports = router;