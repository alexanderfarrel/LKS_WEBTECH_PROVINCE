import { useSignout } from "../../services/hooks/signout";

export default function NavAdministrators({ username }) {
  const { handleSignout, isLoading } = useSignout();
  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
      <div className="container">
        <a className="navbar-brand" href="/administrators">
          Administrator Portal
        </a>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li>
            <a
              href="/administrators/list-admins"
              className="nav-link px-2 text-white"
            >
              List Admins
            </a>
          </li>
          <li>
            <a
              href="/administrators/list-users"
              className="nav-link px-2 text-white"
            >
              List Users
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
              className="btn bg-white text-primary ms-4"
              disabled={isLoading}
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
