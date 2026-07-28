import type { User } from "../../auth/types/auth.types";

interface Props {
    user: User;
}

export default function ProfileAvatar({
    user,
}: Props) {

    const initials =
        user.fullName
            .split(" ")
            .map(name => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >

            <div
                className="
                    mx-auto
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-100
                    text-3xl
                    font-bold
                    text-blue-700
                "
            >

                {initials}

            </div>

            <h2
                className="
                    mt-5
                    text-center
                    text-xl
                    font-semibold
                    text-slate-900
                "
            >
                {user.fullName}
            </h2>

            <p
                className="
                    mt-1
                    text-center
                    text-sm
                    text-slate-500
                "
            >
                @{user.fullName}
            </p>

        </div>

    );

}