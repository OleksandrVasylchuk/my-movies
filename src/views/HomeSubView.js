import { useState, useEffect, lazy, Suspense } from "react";
import {
  useParams,
  NavLink,
  useRouteMatch,
  Route,
  Switch,
  useLocation,
  useHistory,
} from "react-router-dom";
import Loader from "react-loader-spinner";
import * as themoviedbAPI from "../services/movieteka-api";
import { aiMovieSummary } from "../services/pollinations";
import noImageAv from "../Image/noImageAvailable.jpg";
import styles from "./Views.module.css";

const CastView = lazy(() =>
  import("./CastView" /* webpackChunkName: "cast-view" */)
);

const ReviewsView = lazy(() =>
  import("./Reviews" /* webpackChunkName: "review-view" */)
);

export default function HomeSubView() {
  const { url, path } = useRouteMatch();
  const { moviesId } = useParams();
  const location = useLocation();
  const history = useHistory();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  // AI-резюме фільму українською (через Pollinations.ai gemini-fast)
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleGenerateAiSummary = async () => {
    if (!movie || aiLoading) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const text = await aiMovieSummary(movie.title, movie.overview || "");
      setAiSummary(text);
    } catch (err) {
      setAiError(err.message || "Не вдалося згенерувати");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    themoviedbAPI
      .getMoviesById(moviesId)
      .then((data) => {
        setMovie(data);
      })
      .catch((error) => setError(error));
  }, [moviesId]);

  const onGoBack = () => {
    history.push(location?.state?.from?.location ?? "/movies");
  };

  return (
    <>
      {movie && (
        <>
          <button type="button" className={styles.button} onClick={onGoBack}>
            ⬅ Go back
          </button>
          <div className={styles.movies}>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : noImageAv
              }
              alt={movie.title}
              width="250"
            />
            <div className={styles.about}>
              <h1 className={styles.movieTitle}>{movie.title}</h1>
              <p>User Score: {movie.vote_average * 10}%</p>
              <p className={styles.overview}>
                Overview
                <span className={styles.descr}>{movie.overview}</span>
              </p>
              {movie.genres && (
                <>
                  <p className={styles.genres}>Genres</p>
                  {movie.genres.map((item, index) => (
                    <span className={styles.genresName} key={index}>
                      {item.name}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>

          <nav className={styles.navigation}>
            <p className={styles.information}>Additional information</p>

            <NavLink
              to={{
                pathname: `${url}/cast`,
                state: { from: { location } },
              }}
              className={styles.link}
              activeClassName={styles.activeLink}
            >
              Cast
            </NavLink>

            <NavLink
              to={{
                pathname: `${url}/reviews`,
                state: { from: { location } },
              }}
              className={styles.link}
              activeClassName={styles.activeLink}
            >
              Reviews
            </NavLink>
          </nav>

          <Suspense
            fallback={
              <Loader
                type="Circles"
                color="#00BFFF"
                height={100}
                width={100}
                timeout={3000} //3 secs
                className={styles.loader}
              />
            }
          >
            <Switch>
              <Route path={`${path}:moviesId/cast`}>
                <CastView moviesId={moviesId} />
              </Route>

              <Route path={`${path}:moviesId/reviews`}>
                <ReviewsView moviesId={moviesId} />
              </Route>
            </Switch>
          </Suspense>
        </>
      )}
    </>
  );
}
