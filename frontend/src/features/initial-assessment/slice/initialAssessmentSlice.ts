import {
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";

export const INITIAL_ASSESSMENT_STORAGE_KEY =
    "careersaathi.initial-assessment";

export type InitialAssessmentStep =
    0 | 1 | 2 | 3;

interface InitialAssessmentState {
    currentStep: InitialAssessmentStep;
    selectedSkillCatalogIds: string[];
    assessmentId: string | null;
}

const initialState: InitialAssessmentState = {
    currentStep: 0,
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
                action: PayloadAction<InitialAssessmentStep>
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