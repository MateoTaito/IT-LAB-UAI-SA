import axios from "axios";
import { API_BASE_URL } from '../config/api';

const API_Admin = axios.create({
	baseURL: `${API_BASE_URL}/admins`,
});

export default API_Admin
