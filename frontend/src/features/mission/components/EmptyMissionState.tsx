import { Target } from "lucide-react";

export default function EmptyMissionState() {

    return (

        <div
            className="
                flex
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                bg-white
                px-6
                py-16
                text-center
            "
        >

            <Target
                size={52}
                className="text-slate-400"
            />

            <h2 className="mt-5 text-xl font-semibold">

                No Missions Yet

            </h2>

            <p className="mt-2 max-w-md text-sm text-slate-500">

                Your weekly learning missions will appear here once
                your career journey begins.

            </p>

        </div>

    );

}