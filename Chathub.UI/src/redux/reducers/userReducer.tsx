import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { login, signup, isLocalUserExist, getLocalUser } from '../../services/userService';

export enum LoginState {
    LoggedIn,
    Loading,
    None
}

export type UserState = {
    userName?: string,
    loginState: LoginState,
    error?: string
}

export type UserInfoResult = {
    username: string
}

export type LoginInfo = {
    Username: string,
    Password: string
}

export type SignupInfo = {
    UserName: string,
    Password: string,
    Email: string   
}

const initialState : UserState = {
    loginState: LoginState.None
};

export const LoginThunk = createAsyncThunk('user/login', async (data: LoginInfo, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
        const token = await login(data, dispatch);
        return fulfillWithValue(token);
    } catch(error) {
        if(error instanceof Error) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue("Unknown error");
    }
});

export const SignupThunk = createAsyncThunk('user/signup', async (data: SignupInfo, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
        const token = await signup(data, dispatch);
        return fulfillWithValue(token);
    } catch (error) {
        if(error instanceof Error) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue("Unknown error");
    }
});

export const userSlice = createSlice({
    name: "user",
    initialState: isLocalUserExist() ? {
        ...getLocalUser(),
        loginState: LoginState.LoggedIn
    } : initialState,
    reducers: {
        loggedOut: () => {
            return initialState;
        }
    },
    extraReducers: builder => {
        builder.addCase(LoginThunk.fulfilled, (state, { payload }) => {
            state.userName = payload.username;
            state.loginState = LoginState.LoggedIn;
            state.error = undefined;
        });
        builder.addCase(LoginThunk.pending, (state) => {
            state.error = undefined;
            state.loginState = LoginState.Loading;
        });
        builder.addCase(LoginThunk.rejected, (state, { payload }) => {
            state.error = typeof payload === 'string' ? payload : undefined;
            state.loginState = LoginState.None;
        });

        builder.addCase(SignupThunk.fulfilled, (state, { payload }) => {
            state.userName = payload.username;
            state.loginState = LoginState.LoggedIn;
            state.error = undefined;
        });
        builder.addCase(SignupThunk.pending, (state) => {
            state.error = undefined;
            state.loginState = LoginState.Loading;
        });
        builder.addCase(SignupThunk.rejected, (state, { payload }) => {
            state.error = typeof payload === 'string' ? payload : undefined;
            state.loginState = LoginState.None;
        });
    }
});

export const selectUserInfo = (state: RootState): UserState => {
    return state.users;
}

export const { loggedOut } = userSlice.actions;

export default userSlice.reducer;