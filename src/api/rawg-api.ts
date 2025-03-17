import axios from "axios";

// Create a new instance of axios with the base URL and the API key from the environment variables

export const rawgApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  params: { key: import.meta.env.VITE_API_KEY },
});
