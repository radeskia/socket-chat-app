const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    register: async (req, res) => {
        const ResponseData = {
            error: false,
            message: "",
            data: {
                access_token: null,
                refresh_token: null,
            },
        };
        try {
            // Check db if email exists
            const checkDuplicate = await User.findOne({
                email: req.body.email,
            });
            if (checkDuplicate) {
                ResponseData.error = true;
                ResponseData.message = "User already exists!";

                res.status(409).json(ResponseData);
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
                ResponseData.error = false;
                ResponseData.message = "Register successful!";

                res.status(200).json(ResponseData);
            }
        } catch (error) {
            ResponseData.error = true;
            ResponseData.message = error.message;

            res.status(400).json(ResponseData);
        }
    },
    login: async (req, res) => {
        const ResponseData = {
            error: false,
            message: "",
            data: {
                access_token: null,
                refresh_token: null,
            },
        };
        try {
            // Check if user exists
            const checkedUser = await User.findOne({
                email: req.body.email,
            });
            if (!checkedUser) {
                ResponseData.error = true;
                ResponseData.message = "No such user found!";

                return res.status(409).json(ResponseData);
            }
            // Compare received password with stored encrypted password
            const checkedPass = bcrypt.compareSync(
                req.body.password,
                checkedUser.password
            );

            // First check if user is found, then check password
            if (!checkedPass) {
                ResponseData.error = true;
                ResponseData.message = "Wrong password!";

                return res.status(403).json(ResponseData);
            } else {
                // MAIN ACCESS TOKEN
                const access_token = jwt.sign(
                    {
                        email: req.body.email,
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
                    },
                    process.env.REFRESH_TOKEN_SECRET,
                    {
                        expiresIn: "15m",
                    }
                );

                ResponseData.error = false;
                ResponseData.message = "Success";
                ResponseData.data.access_token = access_token;
                ResponseData.data.refresh_token = refresh_token;

                return res.status(200).json(ResponseData);
            }
        } catch (error) {
            ResponseData.error = true;
            ResponseData.message = error.message;
            ResponseData.data.access_token = null;
            ResponseData.data.refresh_token = null;

            res.status(400).json(ResponseData);
        }
    },
    refresh: async (req, res) => {
        const ResponseData = {
            error: false,
            message: "",
            data: {
                access_token: null,
                refresh_token: null,
            },
        };
        try {
            const access_token = jwt.sign(
                {
                    email: req.body.email,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "5m",
                }
            );

            const refresh_token = jwt.sign(
                {
                    email: req.body.email,
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            ResponseData.error = false;
            ResponseData.message = "Success";
            ResponseData.data.access_token = access_token;
            ResponseData.data.refresh_token = refresh_token;

            return res.status(200).json(ResponseData);
        } catch (error) {
            ResponseData.error = true;
            ResponseData.message = error.message;

            res.status(400).json(ResponseData);
        }
    },
    get_users: async (req, res) => {
        const ResponseData = {
            error: false,
            message: "",
            data: {
                access_token: null,
                refresh_token: null,
            },
        };
        try {
            const users = await User.find({}, { password: 0, __v: 0 });

            ResponseData.error = false;
            ResponseData.message = "Success";
            ResponseData.data = [...users];

            res.status(200).json(ResponseData);
        } catch (error) {}
    },
};
