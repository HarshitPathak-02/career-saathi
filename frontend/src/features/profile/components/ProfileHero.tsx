import {
    User,
} from "lucide-react";

export default function ProfileHero() {

    return (

        <section
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-sm
            "
        >

            <div className="flex items-start gap-4">

                <div
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                    "
                >

                    <User size={22} />

                </div>

                <div>

                    <p
                        className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-blue-600
                        "
                    >
                        Account
                    </p>

                    <h1
                        className="
                            mt-1
                            text-3xl
                            font-bold
                            text-slate-900
                        "
                    >
                        Profile
                    </h1>

                    <p
                        className="
                            mt-2
                            text-slate-500
                        "
                    >
                        Manage your personal account
                        information.
                    </p>

                </div>

            </div>

        </section>

    );

}