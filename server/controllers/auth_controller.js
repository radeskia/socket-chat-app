const jwt = require("jsonwebtoken");

const PrettyResponse = {
    error: false,
    message: "",
    data: {
        access_token: null,
        refresh_token: null,
    },
};

module.exports = {
    refresh: async (req, res) => {
        try {
            const access_token = jwt.sign(
                {
                    email: req.body.email,
                    password: req.body.password,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "5m",
                }
            );

            const refresh_token = jwt.sign(
                {
                    email: req.body.email,
                    password: req.body.password,
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            PrettyResponse.error = false;
            PrettyResponse.message = "Success";
            PrettyResponse.data.access_token = access_token;
            PrettyResponse.data.refresh_token = refresh_token;

            return res
                .cookie("refresh_token", refresh_token, {
                    maxAge: 24 * 60 * 60 * 1000,
                })
                .status(200)
                .json(PrettyResponse);
        } catch (error) {
            PrettyResponse.error = true;
            PrettyResponse.message = error.message;

            res.status(400).json(PrettyResponse);
        }
    },
};
