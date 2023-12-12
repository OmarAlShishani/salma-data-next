import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface TrainingsState {
    trainings: Array<any>;
    trainingsExports: Array<any>;
    trainingsCount: number;
}

const initialState: TrainingsState = {
    trainings: [],
    trainingsExports: [],
    trainingsCount: 0,
};

export const trainingsSlice = createSlice({
    name: 'trainings',
    initialState,
    reducers: {
        setTrainings: (state, action: PayloadAction<any>) => {
            state.trainings = action.payload;
        },
        setTrainingsExports: (state, action: PayloadAction<any>) => {
            state.trainingsExports = action.payload;
        },
        setTrainingsCount: (state, action: PayloadAction<any>) => {
            state.trainingsCount = action.payload;
        },
        resetTrainings: (state) => {
            state = state;
        },
    },
});

export const {
    setTrainings,
    resetTrainings,
    setTrainingsExports,
    setTrainingsCount,
} = trainingsSlice.actions;

export default trainingsSlice.reducer;
