import axios from "axios";

const isBrowser = typeof window !== "undefined";
const defaultApiBase = isBrowser ? `${window.location.origin}/api` : "/api";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultApiBase;

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});

export default axiosInstance;