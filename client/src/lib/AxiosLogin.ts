import axios from "axios";

const API_Login = axios.create({
	baseURL: "http://localhost:3000/api/login",
});

export default API_Login;
