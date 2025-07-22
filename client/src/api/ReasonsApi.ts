import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_Reasons = axios.create({
    baseURL: `${API_BASE_URL}/reasons`,
});

// Add auth token to requests
API_Reasons.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Reason {
    Id: string;
    Name: string;
    Description?: string;
}

export const listReasons = async (): Promise<Reason[]> => {
    const response = await API_Reasons.get('/list-reasons');
    return response.data;
};

export const createReason = async (reason: { Name: string; Description?: string }) => {
    const response = await API_Reasons.post('/create-reason', reason);
    return response.data;
};

export const deleteReasonByName = async (name: string) => {
    const response = await API_Reasons.delete('/delete-reason', { data: { Name: name } });
    return response.data;
};

export default API_Reasons;
