import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/hooks/api";
import { formatDate } from "../../../services/hooks/formatDate";
import { toast } from "sonner";

export default function DetailGameView() {
  const location = useLocation();
  const slug = location.state || null;
  const [data, setData] = useState([]);
  const [scores, setScores] = useState([]);
  const Navigate = useNavigate();
  const fetchScores = () => {
    api.get(`/games/${slug.slug}/scores`).then((res) => {
      if (res.status == 200) {
        setScores(res.data.scores);
      } else {
        toast.error("Ups something went wrong");
      }
    });
  };
  const fetchData = () => {
    api.get(`/games/${slug.slug}`).then((res) => {
      if (res.status == 200) {
        setData(res.data);
        fetchScores();
      } else {
        toast.error("Ups something went wrong");
      }
    });
  };
  useEffect(() => {
    if (!slug) {
      toast.error("U can't access it directly");
      return Navigate("/");
    }
    fetchData();
  }, []);

  const handleDownload = () => {
    api
      .get(`/games/${slug.slug}/${data?.thumbnail?.split("/")[3]}`)
      .then((res) => {
        if (res.status == 200) {
          window.open(
            `${import.meta.env.VITE_API_BASE_URL}/games/${slug.slug}/${
              data?.thumbnail?.split("/")[3]
            }/download`,
            "_blank"
          );
        }
      })
      .catch(() => {
        toast.error("Ups game file not found");
      });
  };
  return (
    <>
      <main>
        <div className="hero py-5 bg-light">
          <div className="container text-center">
            <h2 className="mb-1">{data?.title}</h2>

            <a
              onClick={() => {
                Navigate("/profile", {
                  state: { user: { username: data.author } },
                });
              }}
              className="btn btn-success capitalize"
            >
              By {data?.author}
            </a>
            <div className="text-muted">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque,
              numquam repellendus perspiciatis cupiditate veritatis porro quod
              eveniet animi perferendis molestias debitis temporibus, asperiores
              iusto.
            </div>
            <h5 className="mt-2">
              {` Last Versions ${data?.thumbnail?.split("/")[3]} (${formatDate(
                data?.uploadTimestamp
              )})`}
            </h5>
          </div>
        </div>

        <div className="py-5">
          <div className="container">
            <div className="row justify-content-center ">
              <div className="col-lg-5 col-md-6">
                <div className="row">
                  <div className="col">
                    <div className="card mb-3">
                      <div className="card-body">
                        <h5>Top 10 Leaderboard</h5>
                        <ol>
                          {scores.length > 0 ? (
                            scores?.map((score, i) => (
                              <li
                                key={i}
                                className={`${
                                  slug.username == score.username
                                    ? "font-bold"
                                    : ""
                                }`}
                              >
                                {score.username} ({score.score})
                              </li>
                            ))
                          ) : (
                            <li>-</li>
                          )}
                        </ol>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <img
                      src={
                        data.thumbnailUrl !== null
                          ? import.meta.env.VITE_API_BASE_URL_FOR_IMAGE +
                            data.thumbnailUrl
                          : "thumbnail.png"
                      }
                      alt="Demo Game 1 Logo"
                      style={{ width: "100%" }}
                    />
                    <a
                      className="btn btn-primary w-100 mb-2 mt-2"
                      onClick={handleDownload}
                    >
                      Download Game
                    </a>
                  </div>
                </div>

                <a
                  onClick={() => Navigate(-1)}
                  className="btn btn-danger w-100"
                >
                  Back
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
