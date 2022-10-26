const User = require("../models/user");

const PrettyResponse = {
    error: false,
    message: "",
};

module.exports = {
    register: async (req, res) => {
        try {
            // Check db if username exists
            const checkDuplicate = await User.findOne({
                username: req.body.username,
            });
            if (checkDuplicate) {
                PrettyResponse.error = true;
                PrettyResponse.message = "User already exists!";

                res.status(409).json(PrettyResponse);
            } else {
                // Create new user Object
                const newUser = new User({
                    username: req.body.username,
                    password: req.body.password,
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
            // Boolean check if user exists
            const checkUser = await User.findOne({
                username: req.body.username,
            });

            // Boolean check if user & password match
            const checkUserPassword = await User.findOne({
                username: req.body.username,
                password: req.body.password,
            });

            // First check if user is found, then check if user & password match
            if (!checkUser) {
                PrettyResponse.error = true;
                PrettyResponse.message = "No such user found!";

                res.status(409).json(PrettyResponse);
            } else if (!checkUserPassword) {
                PrettyResponse.error = true;
                PrettyResponse.message = "Wrong password!";

                res.status(403).json(PrettyResponse);
            } else {
                PrettyResponse.error = false;
                PrettyResponse.message = "Logged in!";

                res.status(200).json(PrettyResponse);
            }
        } catch (error) {
            PrettyResponse.error = true;
            PrettyResponse.message = error.message;

            res.status(400).json(PrettyResponse);
        }
    },
};
