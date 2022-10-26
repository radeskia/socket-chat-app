const Modal = ({ showModal, setShowModal, title, content }: any) => {
    return (
        <div
            className={`${
                showModal ? "block" : "hidden"
            } z-50 text-white absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-black`}
        >
            <div className="w-80 bg-slate-900 h-36 p-2 flex flex-col justify-between text-center">
                <p className="text-lg">{title}</p>
                <p className="text-sm text-slate-400">{content}</p>
                <button
                    className="bg-gray-600 hover:bg-gray-500 max-w-xs mx-auto px-5 py-1 my-2 rounded shadow-lg mb-5"
                    onClick={() =>
                        setShowModal({
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
    );
};

export default Modal;
