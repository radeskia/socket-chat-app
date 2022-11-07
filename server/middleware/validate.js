const PrettyResponse = {
    error: false,
    message: "",
};

const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body);
        return next();
    } catch (error) {
        PrettyResponse.error = true;
        PrettyResponse.message = error.message;
        return res.status(500).json(PrettyResponse);
    }
};

module.exports = { validate };
