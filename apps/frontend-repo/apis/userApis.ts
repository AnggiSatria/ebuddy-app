import Cookies from "js-cookie";
import { User } from "../../../packages/interface/user.interfaces";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API || "http://localhost:8000";

export const fetchUserData = async (): Promise<User> => {
  const token = Cookies.get("accessToken");
  const res = await axios.get(`${baseURL}/api/fetch-user-data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateUserData = async (id, payload): Promise<User> => {
  const res = await axios.put(`$${baseURL}/api/update-user-data${id}`, payload);
  return res.data;
};
