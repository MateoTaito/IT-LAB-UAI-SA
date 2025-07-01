import axios from 'axios';

const API_Attendance = axios.create({
    baseURL: 'http://localhost:3001/api/attendance',
});

// Add auth token to requests (for admin functions)
API_Attendance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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

export const checkInUser = async (data: UserCheckInDTO) => {
    const response = await API_Attendance.post('/check-in-user', data);
    return response.data;
};

export const checkOutUser = async (data: UserCheckOutDTO) => {
    const response = await API_Attendance.post('/check-out-user', data);
    return response.data;
};

export const listActiveUsers = async () => {
    const response = await API_Attendance.get('/list-active-users');
    return response.data;
};

export const listInactiveUsers = async () => {
    const response = await API_Attendance.get('/list-inactive-users');
    return response.data;
};

export const listAllUsersAttendance = async () => {
    const response = await API_Attendance.get('/list-all-users');
    return response.data;
};

export default API_Attendance;
