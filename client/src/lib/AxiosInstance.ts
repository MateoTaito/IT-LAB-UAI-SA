import axios from "axios";
import { API_BASE_URL } from "../config/api";

const envApiUrl =
  import.meta.env.VITE_API_BASE_URL || `http://localhost:3002/api`;

const API_Instances = axios.create({
  baseURL: `${envApiUrl}/instance`,
});

export default API_Instances;
