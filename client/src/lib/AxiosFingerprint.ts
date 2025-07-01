import axios from "axios";

const API_Fingerprint = axios.create({
	baseURL: "http://192.168.2.8:5000/api/",
});

export default API_Fingerprint;
