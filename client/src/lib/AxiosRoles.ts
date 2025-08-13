import axios from "axios";
import { getSelectedInstanceApiUrl } from "../config/selectedInstanceApi";

const API_Roles = axios.create({
    baseURL: `${getSelectedInstanceApiUrl()}/roles`,
});

// Add interceptor to update baseURL dynamically
API_Roles.interceptors.request.use((config) => {
    config.baseURL = `${getSelectedInstanceApiUrl()}/roles`;
    return config;
});

// Add authorization header to requests when token is available

export default API_Roles;
