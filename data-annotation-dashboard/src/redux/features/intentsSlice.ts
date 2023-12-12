import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IntentsState {
    intents: Array<any>;
    roles: Array<any>;
    intentsCount: number;
}

const initialState: IntentsState = {
    intents: [],
    roles: [],
    intentsCount: 0,
};

export const intentsSlice = createSlice({
    name: 'intents',
    initialState,
    reducers: {
        setIntents: (state, action: PayloadAction<any>) => {
            state.intents = action.payload;
        },
        setIntentsRoles: (state, action: PayloadAction<any>) => {
            state.roles = action.payload;
        },
        setIntentsCount: (state, action: PayloadAction<any>) => {
            state.intentsCount = action.payload;
        },
        resetIntents: (state) => {
            state = state;
        },
        resetIntentsRoles: (state) => {
            state.roles = [];
        },
    },
});

export const {
    setIntents,
    resetIntents,
    setIntentsCount,
    setIntentsRoles,
    resetIntentsRoles,
} = intentsSlice.actions;

export default intentsSlice.reducer;
