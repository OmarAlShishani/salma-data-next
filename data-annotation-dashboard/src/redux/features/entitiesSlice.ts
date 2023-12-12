import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface EntitiesState {
    entities: Array<any>;
    entitiesCount: number;
    roles: Array<any>;
    entitiesIntentsRelation: Array<any>;
    intentsForEntitiesIntents: Array<any>;
}

const initialState: EntitiesState = {
    entities: [],
    entitiesCount: 0,
    roles: [],
    entitiesIntentsRelation: [],
    intentsForEntitiesIntents: [],
};

export const entitiesSlice = createSlice({
    name: 'entities',
    initialState,
    reducers: {
        setEntities: (state, action: PayloadAction<any>) => {
            state.entities = action.payload;
        },
        setEntitiesCount: (state, action: PayloadAction<any>) => {
            state.entitiesCount = action.payload;
        },
        setEntitiesRoles: (state, action: PayloadAction<any>) => {
            state.roles = action.payload;
        },
        resetEntitiesRoles: (state) => {
            state.roles = [];
        },
        setEntitiesIntentsRelation: (state, action: PayloadAction<any>) => {
            state.entitiesIntentsRelation = action.payload;
        },
        setIntentsForEntitiesIntents: (state, action: PayloadAction<any>) => {
            state.intentsForEntitiesIntents = action.payload;
        },
        resetEntitiesIntentsRelation: (state) => {
            state.entitiesIntentsRelation = [];
        },
        resetEntities: (state) => {
            state = state;
        },
    },
});

export const {
    setEntities,
    resetEntities,
    setEntitiesCount,
    setEntitiesRoles,
    resetEntitiesRoles,
    setEntitiesIntentsRelation,
    resetEntitiesIntentsRelation,
    setIntentsForEntitiesIntents
} = entitiesSlice.actions;

export default entitiesSlice.reducer;
