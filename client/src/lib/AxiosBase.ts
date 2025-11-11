import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API_Base = axios.create({
  baseURL: `${API_BASE_URL}/`,
});

export default API_Base;
