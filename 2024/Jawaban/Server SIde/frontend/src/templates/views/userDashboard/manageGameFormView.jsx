import { toast } from "sonner";
import api from "../../../services/hooks/api";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../../services/hooks/formatDate";

export default function ManageGameFormView() {
  const [image, setImage] = useState(null);
  const [gameData, setGameData] = useState(null);
  const location = useLocation();
  const data = location.state || {};
  const fetchGameData = () => {
    api.get(`games/${data.slug}`).then((res) => {
      setGameData(res.data);
      setImage(
        import.meta.env.VITE_API_BASE_URL_FOR_IMAGE + res.data.thumbnailUrl
      );
    });
  };
  useEffect(() => {
    if (data.slug) {
      fetchGameData();
    }
  }, [data]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (JSON.stringify(data) == "{}") {
      const response = api
        .post(
          "/games",
          {
            title: e.target.title.value,
            description: e.target.description.value,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
            const formData = new FormData();
            formData.append("zipfile", e.target.game.files[0]);
            formData.append("thumbnail", e.target.thumbnail.files[0]);
            formData.append("token", localStorage.getItem("token"));
            api
              .post(`/games/${res.data.slug}/upload`, formData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                if (res.status == 200) {
                  window.location.href = "/manage-games";
                }
              });
          }
        });

      toast.promise(response, {
        loading: "Creating game...",
        success: "Game created successfully",
        error: (error) => {
          if (!error.response.data.message) {
            return "Ups something went wrong";
          }
          return error.response.data.message;
        },
      });
    } else {
      const response = api
        .put(
          `games/${data.slug}`,
          {
            title: e.target.title.value,
            description: e.target.description.value,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            const formData = new FormData();
            formData.append("zipfile", e.target.game.files[0]);
            formData.append("thumbnail", e.target.thumbnail.files[0]);
            formData.append("token", localStorage.getItem("token"));
            api
              .post(`/games/${data.slug}/upload`, formData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "content-type": "multipart/form-data",
                },
              })
              .catch(() => {})
              .finally(() => {
                window.location.href = "/manage-games";
              });
          }
          toast.promise(response, {
            loading: "Updating game...",
            success: "Game updated successfully",
            error: (error) => {
              if (!error.response.data.message) {
                return "Ups something went wrong";
              }
              return error.response.data.message;
            },
          });
        });
    }
  };

  const updateImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  return (
    <main>
      <div className="hero py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-3">Manage Games - Gaming Portal</h2>
        </div>
      </div>

      <div className="py-5">
        <div className="container">
          <div className="row justify-content-center ">
            <div className="col-lg-5 col-md-6">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-item card card-default my-4">
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="title" className="mb-1 text-muted">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        placeholder="Title"
                        className="form-control"
                        name="title"
                        defaultValue={data?.title}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-item card card-default my-4">
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="description" className="mb-1 text-muted">
                        Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="description"
                        className="form-control"
                        placeholder="Description"
                        id="description"
                        cols="30"
                        rows="5"
                        defaultValue={data?.description}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="form-item card card-default my-4">
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="thumbnail" className="mb-1 text-muted">
                        Thumbnail <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        name="thumbnail"
                        className="form-control"
                        id="thumbnail"
                        required
                        onChange={updateImage}
                      />
                      {image && <img src={image} alt="Thumbnail" width="80" />}
                    </div>
                  </div>
                </div>
                <div className="form-item card card-default my-4">
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="game" className="mb-1 text-muted">
                        File Game <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        name="game"
                        className="form-control"
                        id="game"
                        required
                      />
                      {gameData && <b>Versions:</b>}
                      {gameData?.versionHistory?.map((game, i) => (
                        <ul className="mb-0" key={i}>
                          <li>
                            {game.version} - {formatDate(game.createdAt)}
                          </li>
                        </ul>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 row">
                  <div className="col">
                    <button type="submit" className="btn btn-primary w-100">
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
