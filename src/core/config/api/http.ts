import axios from "axios";
import {baseURL} from "./baseURL";

export const http = axios.create({
  withCredentials: true,
  //@ts-ignore
  baseURL: baseURL(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
});