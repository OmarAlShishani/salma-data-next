import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface SmallTalkTestingsState {
    smallTalkTestings: Array<any>;
    smallTalkTestingsCount: number;
    smallTalkTestingsExports: Array<any>;
}

const initialState: SmallTalkTestingsState = {
    smallTalkTestings: [],
    smallTalkTestingsCount: 0,
    smallTalkTestingsExports: [],
};

export const smallTalkTestingsSlice = createSlice({
    name: 'smallTalkTestings',
    initialState,
    reducers: {
        setSmallTalkTestings: (state, action: PayloadAction<any>) => {
            state.smallTalkTestings = action.payload;
        },
        setSmallTalkTestingsCount: (state, action: PayloadAction<any>) => {
            state.smallTalkTestingsCount = action.payload;
        },
        setSmallTalkTestingsExports: (state, action: PayloadAction<any>) => {
            state.smallTalkTestingsExports = action.payload;
        },
        resetSmallTalkTestings: (state) => {
            state = state;
        },
    },
});

export const {
    setSmallTalkTestings,
    resetSmallTalkTestings,
    setSmallTalkTestingsExports,
    setSmallTalkTestingsCount,
} = smallTalkTestingsSlice.actions;

export default smallTalkTestingsSlice.reducer;
