import axios from 'axios';

const API_Attendance = axios.create({
    baseURL: 'http://localhost:3000/api/attendance',
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

export interface ActiveUser {
    Id: number;
    UserId: number;
    ReasonId: number;
    CheckIn: string;
    CheckOut: string | null;
    Email: string;
    Name: string;
    LastName: string;
    Rut: string;
    Reason: string;
}

export const checkInUser = async (data: UserCheckInDTO) => {
    const response = await API_Attendance.post('/check-in-user', data);
    return response.data;
};

export const checkOutUser = async (data: UserCheckOutDTO) => {
    const response = await API_Attendance.post('/check-out-user', data);
    return response.data;
};

export const listActiveUsers = async (): Promise<ActiveUser[]> => {
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

export const getRecentActivity = async (limit: number = 10): Promise<ActiveUser[]> => {
    const response = await API_Attendance.get('/list-all-users');
    const allAttendance = response.data;
    
    // Sort by most recent activity (CheckIn or CheckOut)
    const sorted = allAttendance.sort((a: any, b: any) => {
        const aTime = new Date(a.CheckOut || a.CheckIn).getTime();
        const bTime = new Date(b.CheckOut || b.CheckIn).getTime();
        return bTime - aTime;
    });
    
    return sorted.slice(0, limit);
};

export default API_Attendance;
