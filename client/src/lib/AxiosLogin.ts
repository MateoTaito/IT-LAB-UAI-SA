import axios from "axios";
import { API_BASE_URL } from '../config/api';

const API_Login = axios.create({
	baseURL: `${API_BASE_URL}/login`,
});

export default API_Login;
