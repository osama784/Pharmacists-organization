export interface SuccessResponse<T> {
    success: true;
    data?: T;
    meta?: Record<string, any>;
}

export interface ErrorResponse {
    success: false;
    details?: string[];
}
