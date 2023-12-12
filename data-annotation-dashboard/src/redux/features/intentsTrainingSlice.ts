import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface IntentsTrainingsState {
    intentsTrainings: Array<any>;
    intentsTrainingsCount: number;
    intentsTrainingsExports: Array<any>;
}
const initialState: IntentsTrainingsState = {
    intentsTrainings: [],
    intentsTrainingsCount: 0,
    intentsTrainingsExports: [],
};

export const intentsTrainingsSlice = createSlice({
    name: 'intentsTrainings',
    initialState,
    reducers: {
        setIntentsTrainings: (state, action: PayloadAction<any>) => {
            state.intentsTrainings = action.payload;
        },
        setIntentsTrainingsCount: (state, action: PayloadAction<any>) => {
            state.intentsTrainingsCount = action.payload;
        },
        setIntentsTrainingsExports: (state, action: PayloadAction<any>) => {
            state.intentsTrainingsExports = action.payload;
        },
        resetIntentsTrainings: (state) => {
            state = state;
        },
    },
});

export const {
    setIntentsTrainings,
    resetIntentsTrainings,
    setIntentsTrainingsExports,
    setIntentsTrainingsCount,
} = intentsTrainingsSlice.actions;

export default intentsTrainingsSlice.reducer;
