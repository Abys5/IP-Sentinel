type GenericHTTPResponse<T = any> = {
    ok: boolean;
    error?: string;
    data?: T;
};

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";