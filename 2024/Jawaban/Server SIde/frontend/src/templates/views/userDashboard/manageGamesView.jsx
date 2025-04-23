import { useCallback, useEffect, useState } from "react";
import NavUserDashboard from "../../components/navUserDashboard";
import api from "../../../services/hooks/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ManageGamesView({ username }) {
  const [data, setData] = useState([]);
  const Navigate = useNavigate();
  console.log(data);
  const fetchData = useCallback(async () => {
    await api
      .get(`/users/${username}`)
      .then(async (res) => {
        // setData(res.data.authoredGames)
        const fetchDetail = await Promise.all(
          res.data.authoredGames.map(async (game) => {
            const response = await api.get(`/games/${game.slug}`);
            return response.data;
          })
        );
        setData(fetchDetail);
      })
      .catch(() => {});
  }, [username]);
  useEffect(() => {
    if (username.length > 0) {
      fetchData();
    }
  }, [fetchData, username]);

  const handleDelete = (slug) => {
    const response = api
      .delete(`games/${slug}`, {
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
      loading: "Deleting game...",
      success: "Game deleted successfully",
      error: (error) => {
        if (!error.response.data.message) {
          return "Ups something went wrong";
        }
        return error.response.data.message;
      },
    });
  };
  return (
    <>
      <NavUserDashboard username={username}></NavUserDashboard>
      <main>
        <div className="hero py-5 bg-light">
          <div className="container">
            <a href="/manage-game-form" className="btn btn-primary">
              Add Game
            </a>
          </div>
        </div>

        <div className="list-form py-5">
          <div className="container">
            <h6 className="mb-3">List Games</h6>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th width="100">Thumbnail</th>
                  <th width="200">Title</th>
                  <th width="500">Description</th>
                  <th width="180">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((game) => (
                  <tr key={game.slug}>
                    <td>
                      <img
                        src={
                          game.thumbnailUrl !== null
                            ? import.meta.env.VITE_API_BASE_URL_FOR_IMAGE +
                              game.thumbnailUrl
                            : "thumbnail.png"
                        }
                        alt={game.title}
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td>{game.title}</td>
                    <td>{game.description} </td>
                    <td>
                      <div className="flex gap-2">
                        <a
                          onClick={() =>
                            Navigate("/detail-game", {
                              state: { slug: game.slug },
                            })
                          }
                          className="btn btn-sm btn-primary"
                        >
                          Detail
                        </a>
                        <a
                          onClick={() =>
                            Navigate("/manage-game-form", { state: game })
                          }
                          className="btn btn-sm btn-secondary"
                        >
                          Update
                        </a>
                        <a
                          onClick={() => handleDelete(game.slug)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </a>
                      </div>
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
