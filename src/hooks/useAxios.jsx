import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function useAxios() {
  return axiosInstance;
}
