import {
    useMeQuery,
    useUpdateProfileMutation,
} from "../../auth/api/authApi";

import { ResumeSkillsCard } from "../../resume";

import {
    useGetWorkspaceQuery,
} from "../../workspace/api/workspaceApi";

import ProfileHero from "../components/ProfileHero";
import ProfileAvatar from "../components/ProfileAvatar";
import UpdateProfileForm from "../form/UpdateProfileForm";
import AccountInformationCard from "../components/AccountInformationCard";
import { showSuccess, showError } from "../../../shared/lib/toast";
import { getApiErrorMessage } from "../../../shared/lib/getApiErrorMessage";
import type { UpdateProfileDto } from "../../auth/types/auth.types";

export default function ProfilePage() {

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useMeQuery();

    const [
        updateProfile,
        {
            isLoading: isUpdating,
        },
    ] = useUpdateProfileMutation();

    const {
        data: workspaceData,
    } = useGetWorkspaceQuery();

    const careerJourneyId =
        workspaceData?.data.careerJourney.id;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50">
                Loading...
            </div>
        );
    }

    if (isError || !data?.data) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <button
                    onClick={() => refetch()}
                >
                    Retry
                </button>
            </div>
        );
    }

    const user = data.data;

    const handleUpdateProfile = async (values: UpdateProfileDto) => {
        try {
            const res = await updateProfile(values).unwrap();
            showSuccess(res.message || "Profile updated successfully.");
        } catch (error) {
            showError(getApiErrorMessage(error));
        }
    };

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                <ProfileHero />

                <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">

                    <ProfileAvatar
                        user={user}
                    />

                    <UpdateProfileForm
                        user={user}
                        loading={isUpdating}
                        onSubmit={handleUpdateProfile}
                    />

                </div>

                <AccountInformationCard
                    user={user}
                />

                {careerJourneyId && (
                    <ResumeSkillsCard
                        careerJourneyId={
                            careerJourneyId
                        }
                    />
                )}

            </div>

        </div>

    );

}