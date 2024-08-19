import HttpStatusCode from "./httpStatusCode";
import { getLocalStorageUser, tokenRefreshed, AccessToken } from "../../redux/reducers/userReducer";
import { useAppDispatch } from "../../redux/hook";

enum RequestMethod {
    GET,
    POST,
    DELETE,
    PUT
}

type HeaderConfig = {
    'Content-Type': string,
    'Accept': string,
    'Authorization': string
} | {
    'Content-Type': string,
    'Accept': string
} | {
    'Accept': string,
    'Authorization': string,
} | {
    'Accept': string
}

async function request<T>(method: RequestMethod, url: string, body?: BodyInit): Promise<T> {
    url = import.meta.env.VITE_SERVER_URL + url
    let userInfo = getLocalStorageUser();
    let headers = headerConfigBuilder(method, userInfo?.token);

    let response = await fetch(url, {
        method: RequestMethod[method],
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

function headerConfigBuilder(method: RequestMethod, jwtToken?: string): HeaderConfig {
    return {
        ...getContentTypeHeader(method),
        ...getAuthorizationHeader(jwtToken),
        'Accept': '*/*'
    }
}

function getContentTypeHeader(method: RequestMethod): {[key: string]: string} | {} {
    const contentTypes: {
        [key: string]: object
    } = {
        'GET': {},
        'POST': {'Content-Type': 'application/json'},
        'PUT': {'Content-Type': 'application/json'},
        'DELETE': {}
    }
    return contentTypes[RequestMethod[method]]
}

function getAuthorizationHeader(token?: string): {[key: string]: string} | {} {
    if(token == null) 
        return {};
    return {
        'Authorization': `Bearer ${token}`
    };
}

async function requestToken(): Promise<AccessToken> {
    const headerConfig = {
        'Accept': '*/*'
    }

    const response = await fetch('refresh', {
        method: 'GET',
        headers: headerConfig,
        credentials: 'include',
    })

    if(response.ok === false) {
        throw new Error(response.statusText);
    }

    return (await response.json()) as AccessToken;
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