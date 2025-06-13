import axios from "axios";

const API_Roles = axios.create({
    baseURL: "http://localhost:4000/api/roles",
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
