import axios from "axios";
import envKeys from "../config/config";

const fetchApi = axios.create({
  baseURL: envKeys.REACT_APP_BACKEND_URL,
});

export default fetchApi;
