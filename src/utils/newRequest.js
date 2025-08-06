import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const newRequest = axios.create({
  baseURL: `${API}/api`,
  withCredentials: true,
});

export default newRequest;
