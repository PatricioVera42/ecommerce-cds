
export class ApiError extends Error{
    status: number;
    constructor(status: number, message: string){
        super(message);
        this.status = status;
    }
};

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (!(options.body instanceof FormData)){
        headers["Content-Type"] = "application/json";
    }
    
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(import.meta.env.VITE_API_URL + path, { ...options, headers });
    
    const body = await res.json();
    if(!res.ok) {
        if(res.status === 401) {
            localStorage.removeItem("token");
        }
        throw new ApiError(res.status, body.error.message);
    }

    return body as T;
};