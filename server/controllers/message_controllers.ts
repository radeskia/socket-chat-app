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
};
