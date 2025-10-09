import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // ← use 3000, not 5000
});
