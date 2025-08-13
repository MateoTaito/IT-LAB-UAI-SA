import axios from "axios";
import { getSelectedInstanceApiUrl } from "../config/selectedInstanceApi";

const API_Reasons = axios.create({
    baseURL: `${getSelectedInstanceApiUrl()}/reasons`,
});

// Add interceptor to update baseURL dynamically
API_Reasons.interceptors.request.use((config) => {
    config.baseURL = `${getSelectedInstanceApiUrl()}/reasons`;
    return config;
});

// Add auth token to requests
export default API_Reasons;
