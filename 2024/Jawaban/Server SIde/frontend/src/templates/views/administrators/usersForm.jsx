import { useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../services/hooks/api";
import { toast } from "sonner";

export default function UsersFormView() {
  const location = useLocation();
  const data = location.state || {};
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.username != undefined) {
      const response = api
        .put(`/users/${data.id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            setTimeout(() => {
              window.location.href = "/administrators/list-users";
            }, 200);
          }
        });

      toast.promise(response, {
        loading: "Updating user...",
        success: "User updated successfully",
        error: (error) => {
          if (!error.response.data.message) {
            return "Ups something went wrong";
          }
          return error.response.data.message;
        },
      });
    } else if (data.username == undefined) {
      const response = api
        .post("/users", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            setTimeout(() => {
              window.location.href = "/administrators/list-users";
            }, 500);
          }
        });

      toast.promise(response, {
        loading: "Creating user...",
        success: "User created successfully",
        error: (error) => {
          if (!error.response.data.message) {
            return "Ups something went wrong";
          }
          return error.response.data.message;
        },
      });
    }
  };
  return (
    <main>
      <div className="hero py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-3">Manage User - Administrator Portal</h2>
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
                        placeholder="Username"
                        className="form-control"
                        name="username"
                        onChange={handleChange}
                        defaultValue={data.username}
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
                    <button className="btn btn-primary w-100" type="submit">
                      Submit
                    </button>
                  </div>
                  <div className="col">
                    <a
                      onClick={() => window.history.back()}
                      className="btn btn-danger w-100"
                    >
                      Back
                    </a>
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
