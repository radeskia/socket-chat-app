import { getIn } from "formik";

const TextField = ({ field, form, label, required, ...props }: any) => {
    const errors = getIn(form.errors, field.name);
    const touched = getIn(form.touched, field.name);

    return (
        <>
            <div className="relative">
                <p className="text-lg text-blue-800">
                    {label ?? ""}
                    {required ? "*" : ""}
                </p>

                <input
                    placeholder="user@gmail.com"
                    className="h-9 px-4 mt-2 bg-gray-800 mb-6 text-blue-50 outline-none rounded shadow-lg w-full"
                    {...field}
                    {...props}
                />

                <p
                    className={`${
                        errors && touched ? "visible" : "invisible"
                    } absolute inset-x-0 bottom-0 text-red-600 text-xs`}
                >
                    {errors}
                </p>
            </div>
        </>
    );
};

export default TextField;
