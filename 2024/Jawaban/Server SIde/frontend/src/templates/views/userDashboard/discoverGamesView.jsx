import { useCallback, useEffect, useRef, useState } from "react";
import NavUserDashboard from "../../components/navUserDashboard";
import api from "../../../services/hooks/api";
import { useNavigate } from "react-router-dom";

export default function DiscoverGamesView({ username }) {
  const [sortBy, setSortBy] = useState("popular");
  const [ascOrDesc, setAscOrDesc] = useState("asc");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasMoreReff = useRef(false);
  const isScrolling = useRef(false);
  const isDataFetched = useRef(false);
  const isAllFetched = useRef(false);
  const Navigate = useNavigate();
  const page = useRef(0);
  const handleSortBy = (value) => {
    setSortBy(value);
  };
  const handleAsc = (value) => {
    setAscOrDesc(value);
  };
  const fetchDataBySortOrDir = useCallback(() => {
    setIsLoading(true);
    const params = {
      page: 0,
      size: page.current == 0 ? 4 : page.current * 4,
      sortBy,
      sortDir: ascOrDesc,
    };
    api
      .get("/games", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params,
      })
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setIsLoading(false));
  }, [sortBy, ascOrDesc]);
  useEffect(() => {
    fetchDataBySortOrDir();
  }, [sortBy, ascOrDesc, fetchDataBySortOrDir]);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    if (page.current * 4 >= data.totalElements) {
      isAllFetched.current = true;
      return;
    }
    // ~~~~~~~~~ vanila javascript ~~~~~~~~~~~
    // const params = new URLSearchParams({
    //   page: 0,
    //   size: 4,
    // });

    // fetch(`/games?${params.toString()}`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // })
    page.current += 1;
    const params = {
      page: page.current - 1,
      size: 4,
    };
    api
      .get("/games", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params,
      })
      .then((res) => {
        if (isDataFetched.current) {
          setData((prevData) => ({
            ...prevData,
            content: [...prevData.content, ...res.data.content],
          }));
        } else {
          setData(res.data);
          isDataFetched.current = true;
        }
        setIsLoading(false);
      });
  }, [data]);
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 20 && !isScrolling.current && !hasMoreReff.current) {
        isScrolling.current = true;
        // hasMoreReff.current = true;
        // fetchData();
      }

      if (e.deltaY <= 10 && isScrolling.current && !hasMoreReff.current) {
        hasMoreReff.current = true;
        fetchData();
      }
    };
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        hasMoreReff.current
      ) {
        fetchData();
      }
    };
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <NavUserDashboard username={username}></NavUserDashboard>
      <main>
        <div className="hero py-5 bg-light">
          <div className="container text-center">
            <h1>Discover Games</h1>
          </div>
        </div>

        <div className="list-form py-5">
          <div className="container">
            <div className="row">
              <div className="col">
                <h2 className="mb-3">300 Game Avaliable</h2>
              </div>

              <div className="col-lg-8" style={{ textAlign: "right" }}>
                <div className="mb-3 flex gap-2">
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      onClick={() => handleSortBy("popular")}
                      className={`btn ${
                        sortBy == "popular"
                          ? "btn-secondary"
                          : "btn-outline-primary"
                      }`}
                    >
                      Popularity
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSortBy("uploaddate")}
                      className={`btn ${
                        sortBy == "uploaddate"
                          ? "btn-secondary"
                          : "btn-outline-primary"
                      }`}
                    >
                      Recently Updated
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSortBy("title")}
                      className={`btn ${
                        sortBy == "title"
                          ? "btn-secondary"
                          : "btn-outline-primary"
                      }`}
                    >
                      Alphabetically
                    </button>
                  </div>

                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      onClick={() => handleAsc("asc")}
                      className={`btn ${
                        ascOrDesc == "asc"
                          ? "btn-secondary"
                          : "btn-outline-primary"
                      }`}
                    >
                      ASC
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAsc("desc")}
                      className={`btn ${
                        ascOrDesc == "desc"
                          ? "btn-secondary"
                          : "btn-outline-primary"
                      }`}
                    >
                      DESC
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {data?.content?.map((game, i) => (
                <div
                  className="col-md-6"
                  key={i}
                  onClick={() =>
                    Navigate("/detail-game", {
                      state: {
                        slug: game.slug,
                        username: JSON.parse(localStorage.getItem("userData"))
                          .username,
                      },
                    })
                  }
                >
                  <a className="card card-default mb-3">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-4">
                          <img
                            src={
                              game.thumbnailUrl !== null
                                ? import.meta.env.VITE_API_BASE_URL_FOR_IMAGE +
                                  game.thumbnailUrl
                                : "thumbnail.png"
                            }
                            alt="Demo Game 1 Logo"
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="col">
                          <h5 className="mb-1">
                            {game.title}{" "}
                            <small className="text-muted">
                              By {game.author}
                            </small>
                          </h5>
                          <div>{game.description}</div>
                          <hr className="mt-1 mb-1" />
                          <div className="text-muted">
                            #scores submitted : {game.scoreCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
              <p className="text-center text-gray-400">
                {isAllFetched.current
                  ? "All Game Fetched"
                  : isLoading
                  ? `Loading...`
                  : `>>>> Scroll To Load More <<<<`}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
