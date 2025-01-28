// -*- coding: utf-8 -*-

export type APIErrorType =  "InvalidAccess" | "ValidationError" | "Forbidden" | "BadRequest" | "unknown";

export type APIError = {
    status: number,
    type: APIErrorType,
    message: string,
    location?: string,
    path?: string,
}

export type APIErrorResponse = {
    errors: APIError[],
}

export const unauthorizedErrorResponse = (message: string | string[]): APIErrorResponse => {
    if (typeof message === "string") {
        return {
            errors: [
                {
                    status: 401,
                    type: "InvalidAccess",
                    message: message,
                },
            ],
        };
    }
    else {
        const errors: APIError[] = [];
        message.forEach((msg) => {
            errors.push({
                status: 401,
                type: "InvalidAccess",
                message: msg,
            });
        });
        return {
            errors: errors,
        };
    }
}

export const forbiddenErrorResponse = (message: string | string[]): APIErrorResponse => {
    const messageList = (typeof message === "string") ? [message] : message;
    const errors: APIError[] = [];
    messageList.forEach((msg) => {
        errors.push({
            status: 403,
            type: "Forbidden",
            message: msg,
        });
    })
    return {
        errors: errors,
    }
}

export const badRequestErrorResponse = (message: string | string[]) => {
    const messageList = (typeof message === "string") ? [message] : message;
    const errors: APIError[] = [];
    messageList.forEach((msg) => {
        errors.push({
            status: 400,
            type: "BadRequest",
            message: msg,
        });
    })
    return {
        errors: errors,
    }
}
