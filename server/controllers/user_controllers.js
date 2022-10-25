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

                res.json(PrettyResponse);
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

                res.json(PrettyResponse);
            }
        } catch (error) {
            PrettyResponse.error = true;
            PrettyResponse.message = error;

            res.json(PrettyResponse);
        }
    },
    login: async (req, res) => {
        try {
            const checkUser = await User.findOne({
                username: req.body.username,
            });
            const checkUserPassword = await User.findOne({
                username: req.body.username,
                password: req.body.password,
            });

            if (!checkUser) {
                PrettyResponse.error = true;
                PrettyResponse.message = "No such user found!";

                res.json(PrettyResponse);
            } else if (!checkUserPassword) {
                PrettyResponse.error = true;
                PrettyResponse.message = "Wrong password!";

                res.json(PrettyResponse);
            } else {
                PrettyResponse.error = false;
                PrettyResponse.message = "Logged in!";

                res.json(PrettyResponse);
            }
        } catch (error) {
            PrettyResponse.error = true;
            PrettyResponse.message = error;
        }
    },
};
