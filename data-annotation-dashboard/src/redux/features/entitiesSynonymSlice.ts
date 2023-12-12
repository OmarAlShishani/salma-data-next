import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface EntitiesSynonymState {
    entitiesSynonym: Array<any>;
    entitiesSynonymCount: number;
    entitiesSynonymExports: Array<any>;
}

const initialState: EntitiesSynonymState = {
    entitiesSynonym: [],
    entitiesSynonymCount: 0,
    entitiesSynonymExports: [],
};

export const entitiesSynonymSlice = createSlice({
    name: 'entitiesSynonym',
    initialState,
    reducers: {
        setEntitiesSynonym: (state, action: PayloadAction<any>) => {
            state.entitiesSynonym = action.payload;
        },
        setEntitiesSynonymCount: (state, action: PayloadAction<any>) => {
            state.entitiesSynonymCount = action.payload;
        },
        setEntitiesSynonymExports: (state, action: PayloadAction<any>) => {
            state.entitiesSynonymExports = action.payload;
        },
        resetEntitiesSynonym: (state) => {
            state = state;
        },
    },
});

export const {
    setEntitiesSynonym,
    setEntitiesSynonymCount,
    setEntitiesSynonymExports,
    resetEntitiesSynonym,
} = entitiesSynonymSlice.actions;

export default entitiesSynonymSlice.reducer;
