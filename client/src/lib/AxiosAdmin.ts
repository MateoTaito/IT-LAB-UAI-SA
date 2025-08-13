import axios from "axios";
import { getSelectedInstanceApiUrl } from "../config/selectedInstanceApi";

const API_Admin = axios.create({
    baseURL: `${getSelectedInstanceApiUrl()}/admins`,
});

// Add interceptor to update baseURL dynamically
API_Admin.interceptors.request.use((config) => {
    config.baseURL = `${getSelectedInstanceApiUrl()}/admins`;
    return config;
});

export default API_Admin;
