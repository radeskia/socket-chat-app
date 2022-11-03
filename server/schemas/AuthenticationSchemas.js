const Yup = require("yup");

const REGISTER_SCHEMA = Yup.object({
    first_name: Yup.string()
        .matches(/^[A-Za-z ]*$/, "Please enter a valid first name")
        .required("First Name is required!"),
    last_name: Yup.string()
        .matches(/^[A-Za-z ]*$/, "Please enter a valid last name")
        .required("Last Name is required!"),
    email: Yup.string()
        .email("Must be a valid email address")
        .required("Email is required!"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters long!")
        .matches(
            /(?=.*[a-z])/,
            "Password must contain at least one lowercase letter!"
        )
        .matches(
            /(?=.*[A-Z])/,
            "Password must contain at least one uppercase letter!"
        )
        .matches(/(?=.*\d)/, "Password must contain at least one number!")
        .matches(
            /(?=.*\W)/,
            "Password must contain at least one special character!"
        ),
});

const LOGIN_SCHEMA = Yup.object({
    email: Yup.string()
        .email("Must be a valid email address")
        .required("Email is required!"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters long!")
        .matches(
            /(?=.*[a-z])/,
            "Password must contain at least one lowercase letter!"
        )
        .matches(
            /(?=.*[A-Z])/,
            "Password must contain at least one uppercase letter!"
        )
        .matches(/(?=.*\d)/, "Password must contain at least one number!")
        .matches(
            /(?=.*\W)/,
            "Password must contain at least one special character!"
        ),
});

module.exports = { REGISTER_SCHEMA, LOGIN_SCHEMA };
