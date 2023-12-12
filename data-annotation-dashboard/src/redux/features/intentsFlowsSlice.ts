import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface IntentsFlowsState {
    intentsFlows: Array<any>;
    intentsFlowsCount: number;
    intentsFlowsExports: Array<any>;
}

const initialState: IntentsFlowsState = {
    intentsFlows: [],
    intentsFlowsCount: 0,
    intentsFlowsExports: [],
};

export const intentsFlowsSlice = createSlice({
    name: 'intentsFlows',
    initialState,
    reducers: {
        setIntentsFlows: (state, action: PayloadAction<any>) => {
            state.intentsFlows = action.payload;
        },
        setIntentsFlowsCount: (state, action: PayloadAction<any>) => {
            state.intentsFlowsCount = action.payload;
        },
        setIntentsFlowsExports: (state, action: PayloadAction<any>) => {
            state.intentsFlowsExports = action.payload;
        },
        resetIntentsFlows: (state) => {
            state = state;
        },
    },
});

export const {
    setIntentsFlows,
    setIntentsFlowsCount,
    setIntentsFlowsExports,
    resetIntentsFlows,
} = intentsFlowsSlice.actions;

export default intentsFlowsSlice.reducer;
