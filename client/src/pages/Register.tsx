import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "../components/Inputs/TextField";
import NotificationModal from "../components/Modals/NotificationModal";
import { AUTHENTICATION_REGISTER_SCHEMA } from "../schemas/AuthentiationSchemas";
import { handleFetch } from "../utils/handleFetch";
import { URL } from "../../../env";

const Register = () => {
    /*
    =============================================================
    TODO: Refactor this Modal into separate component with props,
    so i dont have to copy/paste the code in every component that
    uses it. Modal accepts 3 parameters, "show" boolean & "title"
    and "content" strings.
    =============================================================*/
    const [modal, setModal] = useState<any>({
        show: false,
        title: "Modal title",
        content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis non veniam ullam?",
    });

    const handleRegister = async (formData: any) => {
        try {
            const res = await handleFetch(
                `${URL}:3001/register`,
                "POST",
                formData
            );
            if (res.error) {
                setModal({
                    show: true,
                    title: "Something went wrong...",
                    content: res.message,
                });
            } else {
                setModal({
                    show: true,
                    title: "Success",
                    content: "Registration successful, proceed to Login Page",
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <NotificationModal
                showModal={modal.show}
                setShowModal={setModal}
                title={modal.title}
                content={modal.content}
            />
            <div className="flex flex-col mx-auto w-72 p-4 text-center border justify-between border-gray-700 my-auto shadow-2xl">
                <h1 className="text-2xl mb-4 text-center text-cyan-500">
                    Register
                </h1>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                        avatar: "",
                    }}
                    validationSchema={AUTHENTICATION_REGISTER_SCHEMA}
                    enableReinitialize={true}
                    onSubmit={async (values) => {
                        await handleRegister(values);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="flex flex-col text-left">
                            <Field
                                name="first_name"
                                type="text"
                                component={TextField}
                                label="First Name"
                                required={true}
                                placeholder="John"
                            />
                            <Field
                                name="last_name"
                                type="text"
                                component={TextField}
                                label="Last Name"
                                required={true}
                                placeholder="Smith"
                            />
                            <Field
                                name="email"
                                type="text"
                                component={TextField}
                                label="Email"
                                required={true}
                                placeholder="user@mail.com"
                            />
                            <Field
                                name="password"
                                type={"password"}
                                component={TextField}
                                label="Password"
                                required={true}
                                placeholder="*************"
                            />
                            <Field
                                name="avatar"
                                type="text"
                                component={TextField}
                                label="Avatar URL"
                                required={true}
                                placeholder="https://picture.com/avatar.png"
                            />
                            <button
                                className="bg-gray-600 hover:bg-gray-500 max-w-xs mx-auto px-5 py-1 my-2 rounded shadow-lg mb-5"
                                type="submit"
                            >
                                Register
                            </button>
                            <Link
                                to="/login"
                                className="text-sm text-center text-blue-500"
                            >
                                Login?
                            </Link>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default Register;
