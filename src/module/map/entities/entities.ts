export interface CustomerByState {
    state: string;
    customer: number;
}

export interface CustomersByStateResponse {
    customersByState?: CustomerByState[];
    error?: string;
}

export interface DashboardResponse<T> {
    data?: T;
    error?: string;
}