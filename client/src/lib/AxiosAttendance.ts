import axios from "axios";
import { getSelectedInstanceApiUrl } from "../config/selectedInstanceApi";

const API_Attendance = axios.create({
    baseURL: `${getSelectedInstanceApiUrl()}/attendance`,
});

// Add interceptor to update baseURL dynamically
API_Attendance.interceptors.request.use((config) => {
    config.baseURL = `${getSelectedInstanceApiUrl()}/attendance`;
    return config;
});

// Add auth token to requests (for admin functions)
export default API_Attendance;
