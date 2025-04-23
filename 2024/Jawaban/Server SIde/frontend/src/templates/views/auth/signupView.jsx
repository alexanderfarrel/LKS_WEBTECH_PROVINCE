import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../../services/hooks/api";

export default function SignupView() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const Navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.username.length < 4) {
      toast.error("Username must be at least 4 characters long");
    }

    const response = api
      .post("auth/signup", formData)
      .then((response) => {
        if (response.status == 201) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userData", JSON.stringify({ role: "user" }));
          Navigate("/");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    toast.promise(response, {
      loading: "Signing up...",
      success: "Signed up successfully",
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
      <div className="hero py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-3">Sign Up - Gaming Portal</h2>
          <div className="text-muted">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </div>
        </div>
      </div>

      <div className="py-5">
        <div className="container">
          <div className="row justify-content-center ">
            <div className="col-lg-5 col-md-6">
              <form onSubmit={handleSubmit}>
                <div className="form-item card card-default my-4">
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="username" className="mb-1 text-muted">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input
                        id="username"
                        type="text"
                        required
                        minLength={4}
                        maxLength={60}
                        placeholder="Username"
                        className="form-control"
                        name="username"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-item card card-default my-4">
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="password" className="mb-1 text-muted">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        id="password"
                        type="password"
                        required
                        minLength={5}
                        maxLength={10}
                        placeholder="Password"
                        className="form-control"
                        name="password"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 row">
                  <div className="col">
                    <button
                      className="btn btn-primary w-100"
                      disabled={isLoading}
                      type="submit"
                    >
                      Sign Up
                    </button>
                  </div>
                  <div className="col">
                    <button
                      disabled={isLoading}
                      className="btn btn-danger w-100"
                      onClick={() => Navigate("/signin")}
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
