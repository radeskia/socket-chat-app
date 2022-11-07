const User = require("../models/user");
const bcrypt = require("bcrypt");
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
    register: async (req, res) => {
        try {
            // Check db if email exists
            const checkDuplicate = await User.findOne({
                email: req.body.email,
            });
            if (checkDuplicate) {
                PrettyResponse.error = true;
                PrettyResponse.message = "User already exists!";

                res.status(409).json(PrettyResponse);
            } else {
                // Create new user Object
                const newUser = new User({
                    email: req.body.email,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    avatar:
                        req.body.avatar || "https://i.imgur.com/fR03clc.png",
                    password: await bcrypt.hash(req.body.password, 7),
                });

                // Await db save & return response
                await newUser.save();
                PrettyResponse.error = false;
                PrettyResponse.message = "Register successful!";

                res.status(200).json(PrettyResponse);
            }
        } catch (error) {
            PrettyResponse.error = true;
            PrettyResponse.message = error.message;

            res.status(400).json(PrettyResponse);
        }
    },
    login: async (req, res) => {
        try {
            // Check if user exists
            const checkedUser = await User.findOne({
                email: req.body.email,
            });
            if (!checkedUser) {
                PrettyResponse.error = true;
                PrettyResponse.message = "No such user found!";

                return res.status(409).json(PrettyResponse);
            }
            // Compare received password with stored encrypted password
            const checkedPass = bcrypt.compareSync(
                req.body.password,
                checkedUser.password
            );

            // First check if user is found, then check password
            if (!checkedPass) {
                PrettyResponse.error = true;
                PrettyResponse.message = "Wrong password!";

                return res.status(403).json(PrettyResponse);
            } else {
                // MAIN ACCESS TOKEN
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
                // REFRESH TOKEN
                const refresh_token = jwt.sign(
                    {
                        email: req.body.email,
                        password: req.body.password,
                    },
                    process.env.REFRESH_TOKEN_SECRET,
                    {
                        expiresIn: "15m",
                    }
                );

                PrettyResponse.error = false;
                PrettyResponse.message = "Success";
                PrettyResponse.data.access_token = access_token;
                PrettyResponse.data.refresh_token = refresh_token;

                res.cookie("refresh_token", refresh_token, {
                    maxAge: 24 * 60 * 60 * 1000,
                })
                    .status(200)
                    .json(PrettyResponse);

                // return res.status(200).json(PrettyResponse);
            }
        } catch (error) {
            PrettyResponse.error = true;
            PrettyResponse.message = error.message;

            res.status(400).json(PrettyResponse);
        }
    },
    get_users: async (req, res) => {
        try {
            const users = await User.find({}, { password: 0, __v: 0 });

            PrettyResponse.error = false;
            PrettyResponse.message = "Success";
            PrettyResponse.data = [...users];

            res.status(200).json(PrettyResponse);
        } catch (error) {}
    },
};
