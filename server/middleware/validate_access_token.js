const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = (req, res, next) => {
    const PrettyResponse = {
        error: false,
        message: "",
        data: null,
    };
    try {
        const token = req.header("authorization").split(" ")[1];
        if (token) {
            jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET,
                (error, decoded) => {
                    if (error) {
                        PrettyResponse.error = true;
                        PrettyResponse.message = "Unauthorized!";
                        return res.status(406).json(PrettyResponse);
                    } else {
                        next();
                    }
                }
            );
        } else {
            throw new Error("No token lol");
        }
    } catch (error) {
        PrettyResponse.error = true;
        PrettyResponse.message = "Unauthorized!";

        return res.status(406).json(PrettyResponse);
    }
};
module.exports = { auth };
