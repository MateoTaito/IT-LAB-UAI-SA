import axios from "axios";
import { API_BASE_URL } from '../config/api';

const API_Roles = axios.create({
    baseURL: `${API_BASE_URL}/roles`,
});

// Add authorization header to requests when token is available
API_Roles.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API_Roles;
