const jwt = require("jsonwebtoken");
const JWT_SECRET = require("./config");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(403).json({
                message: "Authorization header missing"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
};

module.exports =
{authMiddleware} ;