import HttpStatusCode from "./httpStatusCode";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { selectUserInfo, RequestToken, tokenRefreshed } from "../redux/reducers/userReducer";

enum RequestMethod {
    GET,
    POST,
    DELETE,
    PUT
}

type HeaderConfig = {
    'Content-Type': string,
    'Accept' : string,
    'Authorization': string
} | {
    'Content-Type': string,
    'Accept' : string
}

async function request<T>(method: RequestMethod, url: string, body?: BodyInit): Promise<T> {
    let userInfo = useAppSelector(selectUserInfo);
    let headers: HeaderConfig = userInfo.token != null ? {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${userInfo.token}`
    } : {
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }

    let response = await fetch(url, {
        method: Object.keys(RequestMethod)[method],
        headers,
        body
    })

    if(response.ok === false) {
        if(response.status === HttpStatusCode.UNAUTHORIZED) {
            try {
                let newTokenInfo = await requestToken();
                let dispatch = useAppDispatch();

                dispatch(tokenRefreshed(newTokenInfo));
                return await request<T>(method, url, body);
            } catch (err) {
                throw new Error(response.statusText);
            }
        }
        throw new Error(response.statusText);
    } 
    return (await response.json()) as T;
}

async function requestToken(): Promise<RequestToken> {
    let userInfo = useAppSelector(selectUserInfo);
    if(userInfo.token == null || userInfo.refreshToken == null) {
        throw new Error("Authorization not found");
    }

    let tokenInfo: RequestToken = {
        Token: userInfo.token,
        RefreshToken: userInfo.refreshToken,
    }

    let headerConfig = {
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }

    const response = await fetch('refresh', {
        method: 'GET',
        headers: headerConfig,
        body: JSON.stringify(tokenInfo)
    })

    if(response.ok === false) {
        throw new Error(response.statusText);
    }

    return (await response.json()) as RequestToken;
}

export async function getRequest<T>(url: string): Promise<T> {
    return await request<T>(RequestMethod.GET, url);
}

export async function postRequest<T>(url: string, body?: BodyInit): Promise<T> {
    return await request<T>(RequestMethod.POST, url, body);
}

export async function putRequest<T>(url: string, body?: BodyInit): Promise<T> {
    return await request<T>(RequestMethod.PUT, url, body);
}

export async function deleteRequest<T>(url: string, body?: BodyInit): Promise<T> {
    return await request<T>(RequestMethod.DELETE, url, body);
}