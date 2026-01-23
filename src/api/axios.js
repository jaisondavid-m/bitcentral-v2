import axios from "axios";

const api = axios.create({
  baseURL: "https://subject-api-dgl2.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;