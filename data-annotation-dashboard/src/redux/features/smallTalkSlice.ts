import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface SmallTalksState {
    smallTalks: Array<any>;
    smallTalksCount: number;
}

const initialState: SmallTalksState = {
    smallTalks: [],
    smallTalksCount: 0,
};

export const smallTalksSlice = createSlice({
    name: 'smallTalks',
    initialState,
    reducers: {
        setSmallTalks: (state, action: PayloadAction<any>) => {
            state.smallTalks = action.payload;
        },
        setSmallTalksCount: (state, action: PayloadAction<any>) => {
            state.smallTalksCount = action.payload;
        },
        resetSmallTalks: (state) => {
            state = state;
        },
    },
});

export const { setSmallTalks, resetSmallTalks, setSmallTalksCount } =
    smallTalksSlice.actions;

export default smallTalksSlice.reducer;
