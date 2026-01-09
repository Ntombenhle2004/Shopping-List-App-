import axios from "axios";

const baseURL =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_API_URL) ||
  ((globalThis as any)?.process?.env?.REACT_APP_API_URL) ||
  "https://server-shoppinglist.onrender.com";

export const api = axios.create({
  baseURL,
});
