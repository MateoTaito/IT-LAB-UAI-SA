import axios from "axios";
const currentHost = window.location.hostname;
const baseHost = currentHost.replace(/:\d+$/, "");

const envApiUrl = `http://${baseHost}/sa_api`;

const API_Instances = axios.create({
  baseURL: `${envApiUrl}/instance`,
});

export default API_Instances;
