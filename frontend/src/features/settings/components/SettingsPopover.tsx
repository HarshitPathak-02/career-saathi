import {
    LogOut,
    Settings,
} from "lucide-react";


interface Props {
    onLogout: () => void;
}

export default function SettingsPopover({
    onLogout,
}: Props) {

    return (

        <div
            className="
                absolute
                left-30
                bottom-5
                z-50
                w-64
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-xl
                animate-in
                fade-in
                zoom-in-95
            "
        >

            <div className="border-b border-slate-100 p-4">

                <div className="flex items-center gap-2">

                    <Settings
                        size={17}
                        className="text-blue-600"
                    />

                    <span className="font-semibold text-slate-900">
                        Account
                    </span>

                </div>

            </div>

            <div className="p-2">
                <button
                    type="button"
                    onClick={() => {
                        console.log("Logout button clicked");
                        onLogout();
                    }}
                    className="
                        mt-1
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-left
                        text-sm
                        font-medium
                        text-red-600
                        transition-all
                        hover:bg-red-50
                    "
                >

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

        </div>

    );

}