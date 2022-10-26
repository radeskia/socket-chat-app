import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "../components/Inputs/TextField";
import { useAuth } from "../providers/auth-context";
import { AUTHENTICATION_LOGIN_SCHEMA } from "../schemas/AuthentiationSchemas";
import { handleFetch } from "../utils/handleFetch";

const Login = () => {
    const { updateUser } = useAuth();

    // MODAL
    const [modal, setModal] = useState<any>({
        show: false,
        title: "Modal title",
        content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis non veniam ullam?",
    });

    const handleLogin = async (formData: any) => {
        try {
            const res = await handleFetch(
                "http://192.168.100.181:3001/login",
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
                updateUser(formData.email);
                localStorage.setItem("email", formData.email);
                console.log(formData.email);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {modal.show && (
                <div className="z-50 text-white absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-black">
                    <div className="w-80 bg-slate-900 h-36 p-2 flex flex-col justify-between text-center">
                        <p className="text-lg">{modal.title}</p>
                        <p className="text-sm text-slate-400">
                            {modal.content}
                        </p>
                        <button
                            className="bg-gray-600 hover:bg-gray-500 max-w-xs mx-auto px-5 py-1 my-2 rounded shadow-lg mb-5"
                            onClick={() =>
                                setModal({
                                    show: false,
                                    title: "Modal title",
                                    content:
                                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis non veniam ullam?",
                                })
                            }
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <div className="flex flex-col mx-auto w-72 p-4 text-center border justify-between border-gray-700 my-auto shadow-2xl">
                <h1 className="text-2xl mb-4 text-center text-cyan-500">
                    Login
                </h1>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={AUTHENTICATION_LOGIN_SCHEMA}
                    enableReinitialize={true}
                    onSubmit={async (values) => {
                        await handleLogin(values);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="flex flex-col text-left">
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
                            <button
                                className="bg-gray-600 hover:bg-gray-500 max-w-xs mx-auto px-5 py-1 my-2 rounded shadow-lg mb-5"
                                type="submit"
                            >
                                Login
                            </button>
                            <Link
                                to="/register"
                                className="text-sm text-center text-blue-500"
                            >
                                Register?
                            </Link>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default Login;
