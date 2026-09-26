import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5002/api", // change if your backend port is different
});

export default api;