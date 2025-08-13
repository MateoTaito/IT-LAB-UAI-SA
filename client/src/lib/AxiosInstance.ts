import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API_Instances = axios.create({
    baseURL: `http://192.168.2.2:3002/api/instance`,
});

export default API_Instances;
