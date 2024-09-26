import axios from "axios";
import { loggedOut } from "../../redux/reducers/userReducer";
import { Dispatch } from "@reduxjs/toolkit";
import HttpStatusCode from "./httpStatusCode";
import { addAccessTokenIntercept, setLocalUser, getLocalUser, removeLocalUser } from "../../services/userService";

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type AccessToken = {
    value: string;
}

const customFetch = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true
})

customFetch.interceptors.request.use(addAccessTokenIntercept);

async function request<T>(method: RequestMethod, url: string, dispatch: Dispatch, payload?: object): Promise<T> {
    try {
        const response = await customFetch<T>({
            method,
            url,
            data: {
                ...payload
            }
        })
        return response.data as T;
    } catch (error) {
        if(axios.isAxiosError(error)) {
            if(error.status === HttpStatusCode.UNAUTHORIZED) {
                try {
                    const token = await refreshToken();
                    const userLocalStorage = getLocalUser();
                    if(userLocalStorage != null) {
                        setLocalUser({
                            ...userLocalStorage,
                            accessToken: token.value
                        });

                        return await request<T>(method, url, dispatch, payload);
                    } 
                } catch (err) {
                    removeLocalUser();
                    dispatch(loggedOut())
                    throw err;
                }
            }
        }
        throw error;
    }
}

async function refreshToken(): Promise<AccessToken> {
    const response = await customFetch<AccessToken>({
        method: 'GET',
        url: 'refresh'
    })

    return response.data as AccessToken;
}

export async function getRequest<T>(url: string, dispatch: Dispatch): Promise<T> {
    return await request<T>('GET', url, dispatch);
}

export async function postRequest<T>(url: string, dispatch: Dispatch, body?: object): Promise<T> {
    return await request<T>('POST', url, dispatch, body);
}

export async function putRequest<T>(url: string, dispatch: Dispatch, body?: object): Promise<T> {
    return await request<T>('PUT', url, dispatch, body);
}

export async function deleteRequest<T>(url: string, dispatch: Dispatch, body?: object): Promise<T> {
    return await request<T>('DELETE', url, dispatch, body);
}