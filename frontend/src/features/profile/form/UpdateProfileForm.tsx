import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { User } from "../../auth/types/auth.types";
import type { UpdateProfileDto } from "../../auth/types/auth.types";

interface Props {
    user: User;
    loading: boolean;
    onSubmit: (data: UpdateProfileDto) => Promise<unknown>;
}

export default function UpdateProfileForm({
    user,
    loading,
    onSubmit,
}: Props) {

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isDirty,
        },
    } = useForm<UpdateProfileDto>({
        defaultValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
        },
    });

    useEffect(() => {
        reset({
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber ?? "",
        });
    }, [user, reset]);

    const submit = async (values: UpdateProfileDto) => {
        await onSubmit(values);
    };

    return (

        <form
            onSubmit={handleSubmit(submit)}
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-sm
            "
        >

            <h2 className="text-xl font-semibold text-slate-900">
                Personal Information
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                Update your personal account details.
            </p>

            <div className="mt-8 space-y-6">

                {/* Full Name */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Full Name
                    </label>

                    <input
                        {...register("fullName", {
                            required: "Full name is required",
                        })}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            px-4
                            py-3
                            outline-none
                            transition
                            focus:border-blue-500
                        "
                    />

                    {errors.fullName && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.fullName.message}
                        </p>
                    )}

                </div>

                {/* Username */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Username
                    </label>

                    <input
                        value={user.fullName}
                        disabled
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-100
                            px-4
                            py-3
                            text-slate-500
                        "
                    />

                </div>

                {/* Email */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Email
                    </label>

                    <input
                        {...register("email", {
                            required: "Email is required",
                        })}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            px-4
                            py-3
                            outline-none
                            transition
                            focus:border-blue-500
                        "
                    />

                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.email.message}
                        </p>
                    )}

                </div>

                {/* Phone */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Phone Number
                    </label>

                    <input
                        {...register("phoneNumber")}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            px-4
                            py-3
                            outline-none
                            transition
                            focus:border-blue-500
                        "
                    />

                </div>

            </div>

            <div className="mt-10 flex justify-end gap-3">

                <button
                    type="button"
                    onClick={() =>
                        reset({
                            fullName: user.fullName,
                            email: user.email,
                            phoneNumber: user.phoneNumber ?? "",
                        })
                    }
                    className="
                        rounded-xl
                        border
                        border-slate-300
                        px-5
                        py-2.5
                        font-medium
                        transition
                        hover:bg-slate-50
                    "
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={!isDirty || loading}
                    className="
                        rounded-xl
                        bg-blue-600
                        px-5
                        py-2.5
                        font-medium
                        text-white
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>

            </div>

        </form>

    );

}