import axios from "axios";

const API_Fingerprint = axios.create({
	baseURL: "http://localhost:5000/api/",
});

export default API_Fingerprint;
