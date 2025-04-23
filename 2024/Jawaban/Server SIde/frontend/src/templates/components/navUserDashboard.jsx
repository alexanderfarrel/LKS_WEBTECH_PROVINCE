import { useSignout } from "../../services/hooks/signout";

export default function NavUserDashboard({ username }) {
  const { handleSignout, isLoading } = useSignout();
  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
      <div className="container">
        <a className="navbar-brand" href="/">
          Gaming Portal
        </a>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li>
            <a href="/discover-games" className="nav-link px-2 text-white">
              Discover Games
            </a>
          </li>
          <li>
            <a href="/manage-games" className="nav-link px-2 text-white">
              Manage Games
            </a>
          </li>
          <li>
            <a href="/profile" className="nav-link px-2 text-white">
              User Profile
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link active bg-dark capitalize rounded-lg">
              Welcome, {username}
            </a>
          </li>
          <li className="nav-item">
            <button
              onClick={handleSignout}
              disabled={isLoading}
              className="btn bg-white text-primary ms-4"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
