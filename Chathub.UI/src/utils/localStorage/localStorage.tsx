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

export function setLocalStorage(data: object): void {
    if(data != null) {
        localStorage.setItem(import.meta.env.LOCALSTORAGE_KEY, JSON.stringify(data));
    }
} 
