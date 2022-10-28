const mongoose = require("mongoose");
const Message = require("../models/message");

const PrettyResponse = {
    error: false,
    message: "",
};

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

            PrettyResponse.error = false;
            PrettyResponse.message = "Success";
            PrettyResponse.data = messages;

            res.status(200).json(PrettyResponse);
        } catch (error) {}
    },
};
