import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import intentsReducer from './features/intentsSlice';
import smallTalksReducer from './features/smallTalkSlice';
import trainingsReducer from './features/trainingsSlice';
import smallTalkTestingsReducer from './features/smallTalkTestingSlice';
import smallTalksPermissionReducer from './features/smallTalksPermissionSlice';
import intentsFlowsReducer from './features/intentsFlowsSlice';
import intentsKeywordsReducer from './features/intentsKeywordsSlice';
import intentsTrainingsReducer from './features/intentsTrainingSlice';
import entitiesReducer from './features/entitiesSlice';
import EntityValuesReducer from './features/entityValuesSlice';
import entitiesSynonymReducer from './features/entitiesSynonymSlice';
import intentsTestingsReducer from './features/intentsTestingSlice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

export const store = configureStore({
    reducer: {
        user: userReducer,
        intents: intentsReducer,
        smallTalks: smallTalksReducer,
        trainings: trainingsReducer,
        smallTalkTestings: smallTalkTestingsReducer,
        smallTalksPermission: smallTalksPermissionReducer,
        intentsFlows: intentsFlowsReducer,
        intentsKeywords: intentsKeywordsReducer,
        intentsTrainings: intentsTrainingsReducer,
        entities: entitiesReducer,
        entityValues: EntityValuesReducer,
        entitiesSynonym: entitiesSynonymReducer,
        intentsTestings: intentsTestingsReducer,
    },
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
