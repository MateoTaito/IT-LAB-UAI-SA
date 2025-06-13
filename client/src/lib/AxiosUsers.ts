import axios from "axios";

const API_Users = axios.create({
    baseURL: "http://localhost:4000/api/users",
});

export default API_Users;
