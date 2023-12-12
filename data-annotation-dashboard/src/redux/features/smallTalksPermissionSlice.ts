import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface SmallTalksPermissionState {
    roles: Array<any>;
}

const initialState: SmallTalksPermissionState = {
    roles: [],
};

export const smallTalksPermissionSlice = createSlice({
    name: 'smallTalksPermission',
    initialState,
    reducers: {
        setSmallTalksPermission: (state, action: PayloadAction<any>) => {
            state.roles = action.payload;
        },
        resetSmallTalksPermission: (state) => {
            state = state;
        },
    },
});

export const { setSmallTalksPermission, resetSmallTalksPermission } =
    smallTalksPermissionSlice.actions;

export default smallTalksPermissionSlice.reducer;
