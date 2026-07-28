interface LogoutModalProps {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutModal({
    open,
    loading,
    onClose,
    onConfirm,
}: LogoutModalProps) {

    if (!open) return null;

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                backdrop-blur-sm
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                "
            >
                <div className="border-b border-slate-200 p-6">

                    <h2 className="text-xl font-semibold text-slate-900">
                        Logout
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Are you sure you want to logout?
                    </p>

                </div>

                <div className="flex justify-end gap-3 p-6">

                    <button
                        onClick={onClose}
                        className="
                            rounded-xl
                            border
                            border-slate-300
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            transition
                            hover:bg-slate-50
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="
                            rounded-xl
                            bg-red-600
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-red-700
                            disabled:opacity-60
                        "
                    >
                        {loading ? "Logging out..." : "Logout"}
                    </button>

                </div>

            </div>
        </div>
    );
}