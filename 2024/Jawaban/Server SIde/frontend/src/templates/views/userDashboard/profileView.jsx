import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/hooks/api";
import { formatDate } from "../../../services/hooks/formatDate";
import { toast } from "sonner";

export default function ProfileView() { 
  const location = useLocation();
  const userData = location?.state?.user || {};
  const [data, setData] = useState([]);
  const userLocalStorage = JSON.parse(localStorage.getItem("userData"));
  const Navigate = useNavigate();
  const fetchData = () => {
    if (userData.username != undefined) {
      api.get(`/users/${userData.username}`).then((res) => {
        setData(res.data);
        if (res.data.authoredGames.length > 0) {
          fetchAuthoredGames(res.data.authoredGames);
        }
      });
    } else if (
      userLocalStorage.username != undefined &&
      userData.username == undefined
    ) {
      api.get(`/users/${userLocalStorage.username}`).then((res) => {
        setData(res.data);
        if (res.data.authoredGames.length > 0) {
          fetchAuthoredGames(res.data.authoredGames);
        }
      });
    }
  };
  const fetchAuthoredGames = async (data) => {
    const gameDetail = await Promise.all(
      data.map(async (game) => {
        const response = await api.get(`/games/${game.slug}`);
        return response.data;
      })
    );

    setData((prevData) => ({
      ...prevData,
      authoredGames: gameDetail,
    }));
  };
  useEffect(() => {
    if (userData.username != undefined || userLocalStorage.role != "admin") {
      fetchData();
    } else {
      toast.error("You are Admin, not Player");
      setTimeout(() => {
        window.history.back();
      }, 1500);
    }
  }, []);

  const handleBackClick = () => {
    window.history.back();
  };

  const handleGameClick = (slug, username = "") => {
    Navigate(`/detail-game`, {
      state: {
        slug,
        username,
      },
    });
  };
  return (
    <>
      <main>
        <div className="hero py-5 bg-light">
          <div className="container text-center">
            <h2 className="mb-1">{data.username}</h2>
            <h5 className="mt-2">
              Last Login {formatDate(data.registeredTimestamp)}
            </h5>
          </div>
        </div>

        <div className="py-5">
          <div className="container">
            <div className="row justify-content-center ">
              <div className="col-lg-5 col-md-6">
                <h5>Highscores per Game</h5>
                <div className="card-body">
                  <ol>
                    {data?.highScores?.length > 0 ? (
                      data?.highScores?.map((highscore) => (
                        <li key={highscore.game.slug}>
                          <a
                            className="cursor-pointer"
                            onClick={() =>
                              handleGameClick(
                                highscore.game.slug,
                                data.username
                              )
                            }
                          >
                            {highscore.game.slug} ({highscore.score})
                          </a>
                        </li>
                      ))
                    ) : (
                      <p>-</p>
                    )}
                  </ol>
                </div>
                {data?.authoredGames?.length > 0 && <h5>Authored Games</h5>}
                {data?.authoredGames?.map((game) => (
                  <a
                    key={game.slug}
                    onClick={() => handleGameClick(game.slug)}
                    className="card card-default mb-3 cursor-pointer"
                  >
                    <div className="card-body">
                      <div className="row">
                        <div className="col-4">
                          <img
                            className="w-full"
                            src={
                              game.thumbnailUrl !== null
                                ? import.meta.env.VITE_API_BASE_URL_FOR_IMAGE +
                                  game.thumbnailUrl
                                : "thumbnail.png"
                            }
                            alt="Demo Game 1 Logo"
                          />
                        </div>
                        <div className="col">
                          <h5 className="mb-1">
                            {game.title}{" "}
                            <small className="text-muted">{game.author}</small>
                          </h5>
                          <div className="-mb-3">{game.description}</div>
                          <hr className="" />
                          <div className="text-muted -mt-3">
                            #scores submitted : {game.scoreCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}

                <span
                  onClick={handleBackClick}
                  className="btn btn-danger w-100"
                >
                  Back
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
