import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface EntityValuesState {
    entityValues: Array<any>;
    entityValuesCount: number;
    entityValuesExports: Array<any>;
}

const initialState: EntityValuesState = {
    entityValues: [],
    entityValuesCount: 0,
    entityValuesExports: [],
};

export const entityValuesSlice = createSlice({
    name: 'entityValues',
    initialState,
    reducers: {
        setEntityValues: (state, action: PayloadAction<any>) => {
            state.entityValues = action.payload;
        },
        setEntityValuesCount: (state, action: PayloadAction<any>) => {
            state.entityValuesCount = action.payload;
        },
        setEntityValuesExports: (state, action: PayloadAction<any>) => {
            state.entityValuesExports = action.payload;
        },
        resetEntityValues: (state) => {
            state = state;
        },
    },
});

export const {
    setEntityValues,
    setEntityValuesCount,
    setEntityValuesExports,
    resetEntityValues,
} = entityValuesSlice.actions;

export default entityValuesSlice.reducer;
