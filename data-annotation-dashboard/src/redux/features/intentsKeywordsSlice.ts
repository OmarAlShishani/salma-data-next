import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface IntentsKeywordsState {
    intentsKeywords: Array<any>;
    intentsKeywordsCount: number;
    intentsKeywordsExports: Array<any>;
    intentsFlowsForKeywords: Array<any>;
}

const initialState: IntentsKeywordsState = {
    intentsKeywords: [],
    intentsKeywordsCount: 0,
    intentsKeywordsExports: [],
    intentsFlowsForKeywords: [],
};

export const intentsKeywordsSlice = createSlice({
    name: 'intentsKeywords',
    initialState,
    reducers: {
        setIntentsKeywords: (state, action: PayloadAction<any>) => {
            state.intentsKeywords = action.payload;
        },
        setIntentsKeywordsCount: (state, action: PayloadAction<any>) => {
            state.intentsKeywordsCount = action.payload;
        },
        setIntentsKeywordsExports: (state, action: PayloadAction<any>) => {
            state.intentsKeywordsExports = action.payload;
        },
        setIntentsFlowsForKeywords: (state, action: PayloadAction<any>) => {
            state.intentsFlowsForKeywords = action.payload;
        },
        resetIntentsKeywords: (state) => {
            state = state;
        },
    },
});

export const {
    setIntentsKeywords,
    setIntentsKeywordsCount,
    setIntentsKeywordsExports,
    resetIntentsKeywords,
    setIntentsFlowsForKeywords,
} = intentsKeywordsSlice.actions;

export default intentsKeywordsSlice.reducer;
