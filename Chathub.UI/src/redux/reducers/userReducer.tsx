import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { postRequest, getRequest } from '../../utils/httpRequest/httpRequest';
import { getLocalStorage, setLocalStorage } from '../../utils/localStorage/localStorage';

const localStorageKey = import.meta.env.LOCALSTORAGE_KEY;

export enum LoginState {
    LoggedIn,
    Loading,
    None
}

export type UserState = {
    token?: string,
    userName?: string,
    loginState: LoginState,
    error?: string
}

export type UserInfoResult = {
    Username: string,
    AccessToken: string
}

export type AccessToken = {
    Value: string
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
    loginState: LoginState
}

const initialState : UserState = getLocalStorage<UserState>(localStorageKey) ?? {
    loginState: LoginState.None
};

export const Login = createAsyncThunk('user/login', async (data: LoginInfo, { rejectWithValue, fulfillWithValue }) => {
    try {
        const token = await postRequest<UserInfoResult>('/login', JSON.stringify(data));
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
        const token = await postRequest<UserInfoResult>('/signup', JSON.stringify(data));
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
            state.loginState = LoginState.None;
            state = {...initialState}
        },
        tokenRefreshed: (state, { payload }) => {
            if('Value' in payload) {
                state.token = payload.Value;
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(Login.fulfilled, (state, { payload }) => {
            state.token = payload.AccessToken;
            state.userName = payload.Username;
            state.loginState = LoginState.LoggedIn;
            setLocalStorage(state);
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
            state.token = payload.AccessToken;
            state.userName = payload.Username;
            state.loginState = LoginState.LoggedIn;
            setLocalStorage(state);
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

export const selectUserInfo = (state: RootState): UserState => {
    return state.users;
}

export const getLocalStorageUser = () => getLocalStorage<UserState>(localStorageKey);

export const { tokenRefreshed, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;