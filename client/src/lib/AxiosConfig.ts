import axios from "axios";
import { getSelectedInstanceApiUrl } from "../config/selectedInstanceApi";

const API_Config = axios.create({
    baseURL: `${getSelectedInstanceApiUrl()}/config`,
});

// Add interceptor to update baseURL dynamically
API_Config.interceptors.request.use((config) => {
    config.baseURL = `${getSelectedInstanceApiUrl()}/config`;
    return config;
});

export default API_Config;
