import {
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";

interface InitialAssessmentState {
    currentStep: 1 | 2 | 3;

    selectedSkillCatalogIds: string[];

    assessmentId: string | null;
}

const initialState: InitialAssessmentState = {
    currentStep: 1,

    selectedSkillCatalogIds: [],

    assessmentId: null,
};

const initialAssessmentSlice =
    createSlice({
        name: "initialAssessment",

        initialState,

        reducers: {
            setAssessmentStep(
                state,
                action: PayloadAction<1 | 2 | 3>
            ) {
                state.currentStep = action.payload;
            },

            toggleSelectedSkill(
                state,
                action: PayloadAction<string>
            ) {
                const skillId = action.payload;

                const exists =
                    state.selectedSkillCatalogIds.includes(
                        skillId
                    );

                if (exists) {
                    state.selectedSkillCatalogIds =
                        state.selectedSkillCatalogIds.filter(
                            (id) => id !== skillId
                        );

                    return;
                }

                state.selectedSkillCatalogIds.push(
                    skillId
                );
            },

            setSelectedSkills(
                state,
                action: PayloadAction<string[]>
            ) {
                state.selectedSkillCatalogIds =
                    action.payload;
            },

            setAssessmentId(
                state,
                action: PayloadAction<string>
            ) {
                state.assessmentId =
                    action.payload;
            },

            resetInitialAssessment() {
                return initialState;
            },
        },
    });

export const {
    setAssessmentStep,
    toggleSelectedSkill,
    setSelectedSkills,
    setAssessmentId,
    resetInitialAssessment,
} = initialAssessmentSlice.actions;

export default initialAssessmentSlice.reducer;