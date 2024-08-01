import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { postRequest } from '../../httpRequest/httpRequest';

enum LoginState {
    LoggedIn,
    Loading,
    None
}

export type UserState = {
    token?: string,
    refreshToken?: string,
    userName?: string,
    loginState: LoginState,
    error?: string
}

export type RequestToken = {
    Token: string,
    RefreshToken: string
}

export type LoginInfo = {
    UserName: string,
    Password: string
}

export type SignupInfo = {
    UserName: string,
    Password: string,
    Email: string   
}

export type UserInfo = {
    userName?: string,
    token?: string,
    refreshToken?: string
}

const initialState : UserState = getLocalStorage() ?? {
    loginState: LoginState.None
};

export const Login = createAsyncThunk('user/login', async (data: LoginInfo, { rejectWithValue, fulfillWithValue }) => {
    try {
        const token = await postRequest<RequestToken>('/login', JSON.stringify(data));
        return fulfillWithValue(token);
    } catch(error) {
        if(error instanceof Error) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue("Unknown error");
    }
});

export const Signup = createAsyncThunk('user/signup', async (data: SignupInfo, { rejectWithValue, fulfillWithValue }) => {
    try {
        const token = await postRequest<RequestToken>('/signup', JSON.stringify(data));
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
    initialState,
    reducers: {
        userLoggedOut: (state) => {
            state = initialState;
        },
        tokenRefreshed: (state, { payload }) => {
            if('Token' in payload && 'RefreshToken' in payload) {
                state.token = payload.Token;
                state.refreshToken = payload.RefreshToken;
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(Login.fulfilled, (state, { payload }) => {
            state.token = payload.Token;
            state.refreshToken = payload.RefreshToken;
            state.loginState = LoginState.LoggedIn;
        });
        builder.addCase(Login.pending, (state) => {
            state.error = undefined;
            state.loginState = LoginState.Loading;
        });
        builder.addCase(Login.rejected, (state, { payload }) => {
            state.error = typeof payload === 'string' ? payload : undefined;
            state.loginState = LoginState.None;
        });

        builder.addCase(Signup.fulfilled, (state, { payload }) => {
            state.token = payload.Token;
            state.refreshToken = payload.RefreshToken;
            state.loginState = LoginState.LoggedIn;
        });
        builder.addCase(Signup.pending, (state) => {
            state.error = undefined;
            state.loginState = LoginState.Loading;
        });
        builder.addCase(Signup.rejected, (state, { payload }) => {
            state.error = typeof payload === 'string' ? payload : undefined;
            state.loginState = LoginState.None;
        });
    }
});

function getLocalStorage(): UserState | undefined {
    try {
        let userInfo = localStorage.getItem('user');
        if(userInfo !== null) {
            return (JSON.parse(userInfo)) as UserState;
        }
        return undefined;
    } catch (error) {
        return undefined;
    }
}

export const selectUserInfo = (state: RootState): UserInfo => {
    return {
        userName: state.users.userName,
        token: state.users.token,
        refreshToken: state.users.refreshToken
    }
}

export const { tokenRefreshed, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;