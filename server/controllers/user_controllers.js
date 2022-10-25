const User = require("../models/user");

module.exports = {
    register: async (req, res) => {
        // console.log(`okay12`);
        // console.log(req.body);
        // res.send(req.body);
        try {
            // Check db if username exists
            const checkDuplicate = await User.findOne({
                username: req.body.username,
            });
            if (checkDuplicate) {
                res.send("User already exists");
            } else {
                // Create new user Object
                const newUser = new User({
                    username: req.body.username,
                    password: req.body.password,
                });

                // Await db save & return response
                await newUser.save();
                res.send("Register successful!");
            }
        } catch (error) {
            res.send(error);
        }
    },
};
