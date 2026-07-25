interface ProgressProps {

    value: number;

    className?: string;

}

export default function Progress({

    value,

    className = "",

}: ProgressProps) {

    const progress =
        Math.min(
            Math.max(value, 0),
            100,
        );

    return (

        <div
            className={`
                h-2
                w-full
                rounded-full
                bg-slate-200
                overflow-hidden
                ${className}
            `}
        >

            <div
                className="
                    h-full
                    rounded-full
                    bg-blue-600
                    transition-all
                    duration-500
                "
                style={{
                    width: `${progress}%`,
                }}
            />

        </div>

    );

}