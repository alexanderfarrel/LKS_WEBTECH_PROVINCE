import { toast } from "sonner";
import api from "./api";

export const validateToken = async ({ admin } = {}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = JSON.parse(localStorage.getItem("userData"));
    userData.username = response.data.username;
    localStorage.setItem("userData", JSON.stringify(userData));
    if (admin && response.data.role !== "admin") {
      window.location.href = "/";
      return toast.error("You are not an admin");
    }
    return response.data.username;
  } catch (error) {
    toast.error(error.response.data.message);
    localStorage.clear();
    window.location.href = "/signin";
  }
};
