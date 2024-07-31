import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

enum LoginState {
    LoggedIn,
    Loading,
    None
}

export interface UserState {
    token?: string,
    refreshToken?: string,
    userName?: string,
    loginState: LoginState,
    error?: string
}

export interface RequestToken {
    Token: string,
    RefreshToken: string
}

export interface LoginInfo {
    UserName: string,
    Password: string
}

export interface SignupInfo {
    UserName: string,
    Password: string,
    Email: string   
}

export interface UserInfo {
    userName?: string,
    token?: string,
    refreshToken?: string
}

const initialState : UserState = getLocalStorage() ?? {
    loginState: LoginState.None
};

export const Login = createAsyncThunk('user/login', async (data: LoginInfo, { rejectWithValue, fulfillWithValue }) => {
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify(data)
    });
    
    if(response.ok === false) {   
        return rejectWithValue(response.statusText);
    }

    return fulfillWithValue(await response.json());
});

export const Signup = createAsyncThunk('user/signup', async (data: SignupInfo, { rejectWithValue, fulfillWithValue }) => {
    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify(data)
    });

    if(response.ok === false) {
        return rejectWithValue(response.statusText);
    }

    return fulfillWithValue(await response.json());
});

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userLoggedOut: (state) => {
            state = initialState;
        },
        tokenRefreshed: (state, {payload}) => {
            if(isRequestToken(payload)) {
                state.token = payload.Token;
                state.refreshToken = payload.RefreshToken;
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(Login.fulfilled, (state, { payload }) => {
            if(isRequestToken(payload)) {
                state.token = payload.Token;
                state.refreshToken = payload.RefreshToken;
                state.loginState = LoginState.LoggedIn;
            } else {
                state.loginState = LoginState.None;
            }
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
            if(isRequestToken(payload)) {
                state.token = payload.Token;
                state.refreshToken = payload.RefreshToken;
                state.loginState = LoginState.LoggedIn;
            } else {
                state.loginState = LoginState.None;
            }
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

function isRequestToken(item: RequestToken | any) {
    if ('Token' in item && 'RefreshToken' in item)
        return true
    return false;
}

function getLocalStorage(): UserState | undefined {
    let userInfo = localStorage.getItem('user');
    if(userInfo !== null) {
        return (JSON.parse(userInfo)) as UserState;
    }
    return undefined;
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