import { InternalAxiosRequestConfig } from "axios";
import { postRequest } from "../utils/httpRequest/httpRequest";
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "../utils/localStorage/localStorage";
import { LoginInfo, SignupInfo, UserInfoResult } from "../redux/reducers/userReducer";
import { Dispatch } from "@reduxjs/toolkit";

const localUserKey = import.meta.env.VITE_USERSTORAGE_KEY;

type UserInfo = UserInfoResult & {
    accessToken: string
}

export function addAccessTokenIntercept(config: InternalAxiosRequestConfig) {
    const userInfo = getLocalStorage<UserInfo>(localUserKey);
    if(userInfo != null) {
        config.headers.Authorization = `Bearer ${userInfo.accessToken}`
    }
    return config;
}

export function setLocalUser(data: UserInfo): void {
    setLocalStorage(localUserKey, data);
}

export function getLocalUser(): UserInfoResult | undefined {
    const userInfo = getLocalStorage<UserInfo>(localUserKey);
    if(userInfo != null) {
        return {
            ...userInfo
        }
    }
    return undefined;
}

export function removeLocalUser(): void {
    removeLocalStorage(localUserKey);
}

export async function login(data: LoginInfo, dispatch: Dispatch): Promise<UserInfoResult> {
    const result = await postRequest<UserInfo>('login', dispatch, data);
    setLocalUser(result);
    return {
        ...result
    }
}

export async function signup(data: SignupInfo, dispatch: Dispatch): Promise<UserInfoResult> {
    const result = await postRequest<UserInfo>('signup', dispatch, data);
    setLocalUser(result);
    return {
        ...result
    }
}

export function isLocalUserExist(): boolean {
    return getLocalUser() != null;
}