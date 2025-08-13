import axios from "axios";
import { getSelectedInstanceApiUrl } from "../config/selectedInstanceApi";

const API_Users = axios.create({
    baseURL: `${getSelectedInstanceApiUrl()}/users`,
});

// Add interceptor to update baseURL dynamically
API_Users.interceptors.request.use((config) => {
    config.baseURL = `${getSelectedInstanceApiUrl()}/users`;
    return config;
});

export default API_Users;
