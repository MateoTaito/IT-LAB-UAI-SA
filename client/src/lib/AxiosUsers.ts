import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_Users = axios.create({
    baseURL: `${API_BASE_URL}/users`,
});

export default API_Users;
