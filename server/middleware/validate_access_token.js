const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const PrettyResponse = {
    error: false,
    message: "",
    data: null,
};

const validate_access_token = (req, res, next) => {
    try {
        const token = req.body.data.access_token;
        if (token) {
            const access_token = req.cookies.access_token;
            jwt.verify(
                access_token,
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
            throw new Error("No cookies lol");
        }
    } catch (error) {
        PrettyResponse.error = true;
        PrettyResponse.message = "Unauthorized!";

        return res.status(406).json(PrettyResponse);
    }
};
module.exports = { validate_access_token };
