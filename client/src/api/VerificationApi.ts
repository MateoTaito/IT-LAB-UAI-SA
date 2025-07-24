import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_Verification = axios.create({
    baseURL: `${API_BASE_URL}/users`,
});

const API_External_Verification = axios.create({
    baseURL: 'http://192.168.2.8:5000/api',  //raspberry ip
});

const API_Attendance_Public = axios.create({
    baseURL: `${API_BASE_URL}/attendance`,
});

const API_Reasons_Public = axios.create({
    baseURL: `${API_BASE_URL}/reasons`,
});

export interface UserCheckInDTO {
    email: string;
    checkIn: string | Date;
    Reason: string;
}

export interface UserCheckOutDTO {
    email: string;
    checkOut: string | Date;
}

export interface Reason {
    Id: string;
    Name: string;
    Description?: string;
}

export const getVerificationUser = async () => {
    const response = await API_External_Verification.post('/verification');
    return response.data; // Should return { email: string }
};

export const getVerificationUserTest = async () => {
    const response = await API_External_Verification.post('/verification-test');
    return response.data; // Should return { email: string }
};

export const checkInUserPublic = async (data: UserCheckInDTO) => {
    const response = await API_Attendance_Public.post('/public-check-in', data);
    return response.data;
};

export const checkOutUserPublic = async (data: UserCheckOutDTO) => {
    const response = await API_Attendance_Public.post('/public-check-out', data);
    return response.data;
};

export const listReasonsPublic = async (): Promise<Reason[]> => {
    const response = await API_Reasons_Public.get('/public-list-reasons');
    return response.data;
};

export const updateUserStatusPublic = async (email: string, status: 'active' | 'inactive') => {
    const response = await API_Verification.put('/public-update-status', {
        Email: email,
        Status: status
    });
    return response.data;
};

export default API_Verification;
