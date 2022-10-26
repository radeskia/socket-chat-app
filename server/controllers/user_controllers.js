const User = require("../models/user");

const PrettyResponse = {
    error: false,
    message: "",
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
                    avatar: req.body.avatar,
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
                email: req.body.email,
            });

            // Boolean check if user & password match
            const checkUserPassword = await User.findOne({
                email: req.body.email,
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
    fetchAvatar: async (req, res) => {
        try {
            // Check db if user exists
            const checkExistence = await User.findOne({
                email: req.body.email,
            });

            if (checkExistence) {
                PrettyResponse.error = true;
                PrettyResponse.message = "User already exists!";

                res.status(409).json(PrettyResponse);
            } else {
                const user = await User.findOne({ email: req.params.id });

                PrettyResponse.error = false;
                PrettyResponse.message = "Success";
                PrettyResponse.email = user.email;
                PrettyResponse.avatar = user.avatar;
                res.status(200).json(PrettyResponse);
            }
        } catch (error) {}
    },
};
