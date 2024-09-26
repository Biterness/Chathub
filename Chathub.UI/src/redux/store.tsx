import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import chatroomReducer from './reducers/chatroomReducer';

export const store = configureStore({
    reducer: {
        users: userReducer,
        chatrooms: chatroomReducer
    }
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];