import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../../services/hooks/api";

export default function SigninView() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // const response = await fetch("http://localhost:8000/api/v1/auth/signin", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // });
    // const data = await response.json();
    const signinPromise = api
      .post("/auth/signin", formData)
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (response.status == 200) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userData", JSON.stringify({ role: data.role }));
          if (data.role === "admin") {
            Navigate("/administrators");
          } else if (data.role === "user") {
            Navigate("/");
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    toast.promise(signinPromise, {
      loading: "Signing in...",
      success: "Signed in successfully",
      error: (error) => {
        if (!error.response.data.message) {
          return "Ups something went wrong";
        }
        return error.response.data.message;
      },
    });
  };

  return (
    <main>
      <section className="login">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-6">
              <h1 className="text-center mb-4">Gaming Portal</h1>
              <div className="card card-default">
                <div className="card-body">
                  <h3 className="mb-3">Sign In</h3>

                  <form
                    action="Administrator Portal/index.html"
                    onSubmit={handleSubmit}
                  >
                    <div className="form-group my-3">
                      <label htmlFor="username" className="mb-1 text-muted">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        defaultValue=""
                        className="form-control"
                        autoFocus
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group my-3">
                      <label htmlFor="password" className="mb-1 text-muted">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        required
                        name="password"
                        defaultValue=""
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mt-4 row">
                      <div className="col">
                        <button
                          disabled={isLoading}
                          type="submit"
                          className="btn btn-primary w-100 disabled:bg-green-400"
                        >
                          Sign In
                        </button>
                      </div>
                      <div className="col">
                        <button
                          disabled={isLoading}
                          onClick={() => Navigate("/signup")}
                          className="btn btn-danger w-100 disabled:bg-green-400"
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
