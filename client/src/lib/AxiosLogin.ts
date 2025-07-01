import axios from "axios";

const API_Login = axios.create({
	baseURL: "http://localhost:3001/api/login",
});

export default API_Login;
