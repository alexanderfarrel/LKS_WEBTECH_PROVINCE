import { useNavigate } from "react-router-dom";
import api from "../../services/hooks/api";

export default function DashboardNav() {
  const data = JSON.parse(localStorage.getItem("userData"));
  const Navigate = useNavigate();
  const handleLogout = () => {
    const token = localStorage.getItem("token");

    api
      .post("/auth/logout", {}, { params: { token } })
      .then((res) => {
        if (res.status != 200) {
          return;
        }
        Navigate("/signin");
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      })
      .catch((err) => alert("ups something went wrong"));
  };
  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-primary">
        <div className="container">
          <a className="navbar-brand" href="#">
            Job Seekers Platform
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarsExampleDefault"
            aria-controls="navbarsExampleDefault"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  {data.username}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
