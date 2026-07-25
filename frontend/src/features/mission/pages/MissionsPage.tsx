import { useNavigate } from "react-router-dom";

import MissionCard from "../components/MissionCard";
import EmptyMissionState from "../components/EmptyMissionState";

import {
    useGetMissionHistoryQuery,
} from "../api/missionApi";

import {
    useGetActiveCareerJourneyQuery,
} from "../../career-setup/api/careerSetupApi";
import { useEffect } from "react";

export default function MissionsPage() {

    const navigate =
        useNavigate();

    /*
    |--------------------------------------------------------------------------
    | Active Career Journey
    |--------------------------------------------------------------------------
    */

    const {

        data: careerJourneyResponse,

        isLoading: isCareerJourneyLoading,

        isError: isCareerJourneyError,

    } = useGetActiveCareerJourneyQuery();

    const activeCareerJourney =
        careerJourneyResponse?.data;


    useEffect(() => {
        console.log("CareerJourneyActive:", activeCareerJourney);
    })

    /*
    |--------------------------------------------------------------------------
    | Mission History
    |--------------------------------------------------------------------------
    */

    const {

        data: missions,

        isLoading: isMissionLoading,

        isError: isMissionError,

    } = useGetMissionHistoryQuery(
        activeCareerJourney?._id ?? "",
        {
            skip: !activeCareerJourney,
        },
    );

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (
        isCareerJourneyLoading ||
        isMissionLoading
    ) {

        return (

            <div className="p-6">

                Loading...

            </div>

        );

    }


    if (
        isCareerJourneyError ||
        isMissionError
    ) {

        return (

            <div className="p-6">

                Something went wrong.

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | No Active Career Journey
    |--------------------------------------------------------------------------
    */

    if (!activeCareerJourney) {

        return (

            <div className="p-6">

                <EmptyMissionState />

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | No Missions
    |--------------------------------------------------------------------------
    */

    if (!missions || missions.length === 0) {

        return (

            <div className="p-6">

                <EmptyMissionState />

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div className="space-y-6 p-6">

            <div>

                <h1 className="text-3xl font-bold">

                    Missions

                </h1>

                <p className="mt-1 text-slate-500">

                    Track your weekly learning missions.

                </p>

            </div>

            <div className="space-y-4">

                {missions.map((mission) => (

                    <MissionCard
                        key={mission.id}
                        mission={mission}
                        onClick={() =>
                            navigate(
                                `/missions/${mission.id}`,
                            )
                        }
                    />

                ))}

            </div>

        </div>

    );

}