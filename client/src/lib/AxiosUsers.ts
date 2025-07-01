import axios from "axios";

const API_Users = axios.create({
    baseURL: "http://localhost:3001/api/users",
});

export default API_Users;
