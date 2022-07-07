import axios from "axios";
import envKeys from "../config/config";

export const fetchApi = axios.create({
  baseURL: envKeys.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

export const fetchApiPrivate = axios.create({
  baseURL: envKeys.REACT_APP_BACKEND_URL,
  withCredentials: true,
});
