const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        // get authorization header
        const authHeader =
            req.headers.authorization;

        // check token exists
        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "No token provided"
            });

        }

        // remove Bearer from token
        const token =
            authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : authHeader;

        // verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // save user data in request
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });

    }

};

module.exports = authMiddleware;