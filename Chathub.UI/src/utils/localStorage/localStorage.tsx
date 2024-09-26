export function getLocalStorage<T>(key: string): T | undefined {
    try {
        let userInfo = localStorage.getItem(key);
        if(userInfo !== null) {
            return (JSON.parse(userInfo)) as T;
        }
        return undefined;
    } catch (error) {
        return undefined;
    }
}

export function setLocalStorage(key: string, data: object): void {
    if (data != null) {
        localStorage.setItem(key, JSON.stringify(data));
    }
} 

export function removeLocalStorage(key: string): void {
    localStorage.removeItem(key);
}