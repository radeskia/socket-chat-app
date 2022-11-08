const mongoose = require("mongoose");
const Message = require("../models/message");

module.exports = {
    getAllMessages: async (req, res) => {
        try {
            const messages = await Message.find();
            res.send(messages);
        } catch (error) {
            res.send(error);
        }
    },
    chatBetween: async (req, res) => {
        const ResponseData = {
            error: false,
            message: "",
        };
        try {
            const messages = await Message.find({
                $or: [
                    {
                        sender: req.params.fromUser,
                        receiver: req.params.toUser,
                    },
                    {
                        sender: req.params.toUser,
                        receiver: req.params.fromUser,
                    },
                ],
            });

            ResponseData.error = false;
            ResponseData.message = "Success";
            ResponseData.data = messages;

            res.status(200).json(ResponseData);
        } catch (error) {
            const ResponseData = {
                error: false,
                message: "",
            };
            ResponseData.error = true;
            ResponseData.message = "Something went wrong!";
            ResponseData.data = null;

            res.status(500).json(ResponseData);
        }
    },
};
