import { useNavigate, useOutletContext } from "react-router-dom";
import NavAdministrators from "../../components/navAdministrators";
import { useEffect, useState } from "react";
import api from "../../../services/hooks/api";
import { formatDate } from "../../../services/hooks/formatDate";
import { toast } from "sonner";

export default function ListUsersView() {
  const { username } = useOutletContext();
  const [data, setData] = useState([]);
  const Navigate = useNavigate();

  const fetchData = () => {
    api
      .get("/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setData(res.data.content);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
    const response = api
      .delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status == 204) {
          fetchData();
        }
      });

    toast.promise(response, {
      loading: "Deleting user...",
      success: "User deleted successfully",
      error: (error) => {
        if (!error.response.data.message) {
          return "Ups something went wrong";
        }
        return error.response.data.message;
      },
    });
  };

  const handleUpdate = (data) => {
    Navigate(`/administrators/users-form`, { state: data });
  };

  const handleLock = (id, reason) => {
    const response = api
      .put(
        `/users/lock/${id}`,
        {
          reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          fetchData();
        }
      });

    toast.promise(response, {
      loading: "Locking user...",
      success: "User locked successfully",
      error: (error) => {
        if (!error.response.data.message) {
          return "Ups something went wrong";
        }
        return error.response.data.message;
      },
    });
  };
  const handleUnlock = (id) => {
    const response = api
      .put(
        `/users/unlock/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          fetchData();
        }
      });

    toast.promise(response, {
      loading: "Unlocking user...",
      success: "User unlocked successfully",
      error: (error) => {
        if (!error.response.data.message) {
          return "Ups something went wrong";
        }
        return error.response.data.message;
      },
    });
  };

  const goToProfile = (user) => {
    console.log(user);
    Navigate(`/profile`, {
      state: {
        user,
      },
    });
  };
  return (
    <>
      <NavAdministrators username={username}></NavAdministrators>
      <main>
        <div className="hero py-5 bg-light">
          <div className="container">
            <a href="users-form" className="btn btn-primary">
              Add User
            </a>
          </div>
        </div>

        <div className="list-form py-5">
          <div className="container">
            <h6 className="mb-3">List Users</h6>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Created at</th>
                  <th>Last login</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((user, i) => (
                  <tr key={i}>
                    <td>
                      <span
                        className="cursor-pointer hover:text-blue-500"
                        onClick={() => goToProfile(user)}
                        target="_blank"
                      >
                        {user.username}
                      </span>
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>{formatDate(user.last_login_at)}</td>
                    <td>
                      {user.delete_reason !== null ? (
                        <span className="bg-danger text-white p-1 d-inline-block rounded-lg px-2">
                          Blocked
                        </span>
                      ) : (
                        <span className="bg-success text-white p-1 d-inline-block rounded-lg px-2">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="flex gap-2">
                      {user.delete_reason !== null ? (
                        <button
                          onClick={() => handleUnlock(user.id)}
                          className="btn btn-sm btn-primary w-[6.5rem]"
                        >
                          Unlock
                        </button>
                      ) : (
                        <select
                          type="button"
                          className="btn btn-primary btn-sm dropdown-toggle w-[6.5rem]"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          defaultValue={""}
                          onChange={(e) => handleLock(user.id, e.target.value)}
                        >
                          <option value="" hidden disabled>
                            Lock
                          </option>
                          <option value="spamming">Spamming</option>
                          <option value="cheating">Cheating</option>
                        </select>
                      )}
                      <button
                        onClick={() => handleUpdate(user)}
                        className="btn btn-sm btn-secondary"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
