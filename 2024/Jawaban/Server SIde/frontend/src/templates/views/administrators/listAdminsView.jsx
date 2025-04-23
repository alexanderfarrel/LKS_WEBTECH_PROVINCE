import { useOutletContext } from "react-router-dom";
import NavAdministrators from "../../components/navAdministrators";
import { useEffect, useState } from "react";
import api from "../../../services/hooks/api";
import { formatDate } from "../../../services/hooks/formatDate";

export default function ListAdminsView() {
  const { username } = useOutletContext();
  const [data, setData] = useState([]);
  const fetchData = () => {
    api
      .get("/admins", {
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
  return (
    <>
      <NavAdministrators username={username}></NavAdministrators>
      <main>
        <div className="list-form py-5">
          <div className="container">
            <h6 className="mb-3">List Admin Users</h6>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Created at</th>
                  <th>Last login</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>{formatDate(user.last_login_at)}</td>
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
