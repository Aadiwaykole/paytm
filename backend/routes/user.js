const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware");
const { signupSchema, signinSchema } = require("../types");
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

module.exports = router;