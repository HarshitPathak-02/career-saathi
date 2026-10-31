import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { showSuccess, showError } from "../../../shared/lib/toast";

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
    formState: { errors, isDirty },
  } = useForm<UpdateProfileDto>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      headline: "",
      bio: "",
      githubUrl: "",
      linkedinUrl: "",
    },
  });

  useEffect(() => {
    reset({
      fullName: user.fullName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber ?? "",
      headline: user.headline ?? "",
      bio: user.bio ?? "",
      githubUrl: user.githubUrl ?? "",
      linkedinUrl: user.linkedinUrl ?? "",
    });
  }, [user, reset]);

  const submit = async (values: UpdateProfileDto) => {
    try {
      await onSubmit(values);
      showSuccess("Profile updated successfully!");
    } catch {
      showError("Failed to update profile. Please try again.");
    }
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
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Personal & Professional Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your public profile, contact details, and developer links.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Full Name & Headline */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              {...register("fullName", {
                required: "Full name is required",
              })}
              placeholder="e.g. Harshit Sharma"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-blue-500
              "
            />
            {errors.fullName && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Professional Headline
            </label>
            <input
              {...register("headline")}
              placeholder="e.g. Aspiring Full Stack Engineer"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-blue-500
              "
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              {...register("email")}
              disabled
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-2.5
                text-sm
                text-slate-500
              "
            />
            <p className="mt-1 text-xs text-slate-400">
              Contact support to change your account email.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <input
              {...register("phoneNumber")}
              placeholder="e.g. +91 9876543210"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-blue-500
              "
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            About / Bio
          </label>
          <textarea
            {...register("bio")}
            rows={3}
            placeholder="Tell us a little about your background, career aspirations, and current learning focus..."
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-2.5
              text-sm
              outline-none
              transition
              focus:border-blue-500
            "
          />
        </div>

        {/* Links: GitHub & LinkedIn */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              GitHub Profile URL
            </label>
            <input
              {...register("githubUrl")}
              placeholder="https://github.com/username"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-blue-500
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              LinkedIn Profile URL
            </label>
            <input
              {...register("linkedinUrl")}
              placeholder="https://linkedin.com/in/username"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-blue-500
              "
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={() =>
            reset({
              fullName: user.fullName || "",
              email: user.email || "",
              phoneNumber: user.phoneNumber ?? "",
              headline: user.headline ?? "",
              bio: user.bio ?? "",
              githubUrl: user.githubUrl ?? "",
              linkedinUrl: user.linkedinUrl ?? "",
            })
          }
          className="
            rounded-xl
            border
            border-slate-300
            px-5
            py-2.5
            text-sm
            font-medium
            text-slate-700
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
            text-sm
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
