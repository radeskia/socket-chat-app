const UserProfileModal = ({
    showModal,
    setShowModal: setModal,
    avatar,
    first_name,
    last_name,
    email,
}: any) => {
    return (
        <div
            className={`${
                showModal ? "block" : "hidden"
            } z-50 text-white absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-black`}
        >
            <div className="w-60 bg-slate-900 h-auto p-2 flex flex-col justify-between text-center border border-gray-800 shadow">
                <img
                    src={avatar}
                    alt="User Avatar."
                    className="w-24 h-24 mx-auto my-4 rounded-full object-cover"
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src =
                            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
                    }}
                />
                <p className="text-lg">{`${first_name} ${last_name}`}</p>
                <p className="text-sm text-gray-500">{`${email}`}</p>
                <button
                    className="bg-gray-600 hover:bg-gray-500 max-w-xs mx-auto px-5 py-1 my-2 rounded shadow-lg mb-5"
                    onClick={() =>
                        setModal({
                            show: false,
                            email: "User Email",
                            avatar: "User Avatar",
                            first_name: "First Name",
                            last_name: "Last Name",
                        })
                    }
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default UserProfileModal;
