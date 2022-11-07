const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const PrettyResponse = {
    error: false,
    message: "",
    data: null,
};

const validate_refresh_token = (req, res, next) => {
    try {
        const token = req.cookies.refresh_token;
        if (token) {
            const refresh_token = req.cookies.refresh_token;
            jwt.verify(
                refresh_token,
                process.env.REFRESH_TOKEN_SECRET,
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
module.exports = { validate_refresh_token };
