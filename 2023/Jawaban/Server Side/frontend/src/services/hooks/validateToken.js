import api from "./api";

const tokenValidate = (setIsLoading) => {
  const token = localStorage.getItem("token") || "";

  // fetch(`http://localhost:8000/api/v1/tokenValidate?${params.toString()}`, {
  //   method: "GET",
  // })
  //   .then((res) => res.json())
  //   .then((data) => console.log(data));
  const params = { token };
  api
    .get("/tokenValidate", {
      params,
    })
    .then((res) => {
      if (res.status == 200) {
        localStorage.setItem(
          "userData",
          JSON.stringify({ username: res.data.body.userData.name })
        );
        setIsLoading(false);
      }
    })
    .catch((err) => (window.location.href = "/signin"));
};

export default tokenValidate;
