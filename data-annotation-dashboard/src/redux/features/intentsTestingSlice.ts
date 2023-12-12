import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface IntentsTestingsState {
    intentsTestings: Array<any>;
    intentsTestingsCount: number;
    intentsTestingsExports: Array<any>;
    allEntities: Array<any>;
}

const initialState: IntentsTestingsState = {
    intentsTestings: [],
    intentsTestingsCount: 0,
    intentsTestingsExports: [],
    allEntities: [],
};

export const intentsTestingsSlice = createSlice({
    name: 'intentsTestings',
    initialState,
    reducers: {
        setIntentsTestings: (state, action: PayloadAction<any>) => {
            state.intentsTestings = action.payload;
        },
        setAllEntities: (state, action: PayloadAction<any>) => {
            state.allEntities = action.payload;
        },
        setIntentsTestingsCount: (state, action: PayloadAction<any>) => {
            state.intentsTestingsCount = action.payload;
        },
        setIntentsTestingsExports: (state, action: PayloadAction<any>) => {
            state.intentsTestingsExports = action.payload;
        },
        resetIntentsTestings: (state) => {
            state = state;
        },
    },
});

export const {
    setIntentsTestings,
    setAllEntities,
    resetIntentsTestings,
    setIntentsTestingsExports,
    setIntentsTestingsCount,
} = intentsTestingsSlice.actions;

export default intentsTestingsSlice.reducer;
