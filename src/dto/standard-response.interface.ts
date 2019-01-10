import ErrorResponse from "./error-response.interface";

export default interface StandardResponse<T> {
    statusCode: number;
    message: string;
    version: string;
    payload: T;
    appName: string;
    error?: ErrorResponse;
    isoDate: string;
    timestamp: number;
}
