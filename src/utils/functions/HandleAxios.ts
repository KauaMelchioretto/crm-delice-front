import {AxiosError, AxiosPromise} from "axios";

const HTTP_STATUS_MESSAGES: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    500: 'INTERNAL_SERVER_ERROR',
};

const UNEXPECTED_ERROR = "UNEXPECTED_ERROR"

export function handleError<T>(e: unknown): T {
    if (e instanceof AxiosError) {
        const defaultKey = HTTP_STATUS_MESSAGES[e.response!.status as number] as string

        return {error: e?.response?.data?.error?.code ?? defaultKey} as T;
    } else {
        return {error: UNEXPECTED_ERROR} as T;
    }
}

export async function handleRequest<T>(f: AxiosPromise<T>): Promise<T> {
    try{
        const r = await f

        return r.data as T
    }catch (e) {
        return handleError(e)
    }
}