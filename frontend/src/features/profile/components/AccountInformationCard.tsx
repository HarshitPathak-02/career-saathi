import {
    Mail,
    Phone,
    ShieldCheck,
    User,
} from "lucide-react";

import type { User as UserType } from "../../auth/types/auth.types";

interface AccountInformationCardProps {
    user: UserType;
}

export default function AccountInformationCard({
    user,
}: AccountInformationCardProps) {
    return (
        <section
            className="
                mt-6
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-sm
            "
        >
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

                <h2
                    className="
                        mt-1
                        text-2xl
                        font-bold
                        text-slate-900
                    "
                >
                    Account Information
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    General information about your CareerSaathi account.
                </p>

            </div>

            <div
                className="
                    mt-8
                    grid
                    gap-5
                    md:grid-cols-2
                "
            >

                <InfoItem
                    icon={<User size={18} />}
                    label="Username"
                    value={user.fullName}
                />

                <InfoItem
                    icon={<Mail size={18} />}
                    label="Email"
                    value={user.email}
                />

                <InfoItem
                    icon={<Phone size={18} />}
                    label="Phone Number"
                    value={
                        user.phoneNumber || "Not provided"
                    }
                />

                <InfoItem
                    icon={<ShieldCheck size={18} />}
                    label="Account Status"
                    value="Active"
                />

            </div>
        </section>
    );
}

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

function InfoItem({
    icon,
    label,
    value,
}: InfoItemProps) {
    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-5
            "
        >
            <div className="flex items-center gap-3">

                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-100
                        text-blue-600
                    "
                >
                    {icon}
                </div>

                <div>

                    <p className="text-sm text-slate-500">
                        {label}
                    </p>

                    <p
                        className="
                            mt-1
                            font-semibold
                            text-slate-900
                            break-all
                        "
                    >
                        {value}
                    </p>

                </div>

            </div>
        </div>
    );
}