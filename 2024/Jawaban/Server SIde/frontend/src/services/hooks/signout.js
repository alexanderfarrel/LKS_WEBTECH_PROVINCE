import { toast } from "sonner";
import api from "./api";
import { useState } from "react";

export const useSignout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSignout = () => {
    setIsLoading(true);
    // const signout = fetch("http://localhost:8000/api/v1/auth/signout", {
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // })
    //   .then((res) => {
    //     if (res.status == 200) {
    //       localStorage.clear();
    //       Navigate("/signin");
    //     }
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
    const signout = api
      .post(
        "auth/signout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          localStorage.clear();
          window.location.href = "/signin";
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    toast.promise(signout, {
      loading: "Signing out...",
      success: "Signed out successfully",
      error: (error) => {
        if (!error.response.data.message) {
          return "Ups something went wrong";
        }
        return error.response.data.message;
      },
    });
  };

  return { handleSignout, isLoading };
};
