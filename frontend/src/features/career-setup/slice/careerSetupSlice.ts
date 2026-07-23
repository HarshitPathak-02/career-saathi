import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { PreferredLanguage } from "../constants/enums";

interface CareerSetupState {
    selectedDirection: "known" | "unknown" | null;

    selectedDomainId: string | null;

    selectedRoleId: string | null;

    targetCompany: string;

    targetDurationMonths: number;

    dailyStudyHours: number;

    preferredLanguage: PreferredLanguage;
}

const initialState: CareerSetupState = {
    selectedDirection: null,

    selectedDomainId: null,

    selectedRoleId: null,

    targetCompany: "",

    targetDurationMonths: 6,

    dailyStudyHours: 2,

    preferredLanguage: PreferredLanguage.ENGLISH,
};

const careerSetupSlice = createSlice({
    name: "careerSetup",

    initialState,

    reducers: {
        setCareerDirection(
            state,
            action: PayloadAction<"known" | "unknown">
        ) {
            state.selectedDirection = action.payload;
        },

        setSelectedDomain(
            state,
            action: PayloadAction<string>
        ) {
            state.selectedDomainId = action.payload;

            // Reset role when domain changes
            state.selectedRoleId = null;
        },

        setSelectedRole(
            state,
            action: PayloadAction<string>
        ) {
            state.selectedRoleId = action.payload;
        },

        updateCareerJourneyForm(
            state,
            action: PayloadAction<{
                targetCompany: string;
                targetDurationMonths: number;
                dailyStudyHours: number;
                preferredLanguage: PreferredLanguage;
            }>
        ) {
            Object.assign(state, action.payload);
        },

        resetCareerSetup() {
            return initialState;
        },
    },
});

export const {
    setCareerDirection,
    setSelectedDomain,
    setSelectedRole,
    updateCareerJourneyForm,
    resetCareerSetup,
} = careerSetupSlice.actions;

export default careerSetupSlice.reducer;