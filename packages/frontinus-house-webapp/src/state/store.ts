import { configureStore } from '@reduxjs/toolkit';
import propHouseReducer from './slices/propHouse';
import delegateReducer from './slices/delegate';
import configurationReducer from './slices/configuration';
import votingReducer from './slices/voting';
import editorReducer from './slices/editor';
import alertReducer from './slices/alert';
import userReducer from './slices/user';
import proposalReducer from './slices/proposal';

const store = configureStore({
  reducer: {
    // backend: backendReducer,
    propHouse: propHouseReducer,
    delegate: delegateReducer,
    configuration: configurationReducer,
    editor: editorReducer,
    voting: votingReducer,
    alert: alertReducer,
    user: userReducer,
    proposal: proposalReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
