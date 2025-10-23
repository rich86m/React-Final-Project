import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import MoviesGrid from "./MoviesGrid";
import "./App.css";
import logo from "./assets/movielogo.png";
import hero from "./assets/hero-bg.jpg";

const API_KEY = "e40237de";
const API_URL = "https://www.omdbapi.com/";

const buildUrl = (params) =>
  `${API_URL}?apikey=${API_KEY}&${new URLSearchParams(params).toString()}`;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("recommended");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  async function loadRecommended() {
    setLoading(true);
    try {
      const ids = [
        "tt0111161",
        "tt0068646",
        "tt0468569",
        "tt0109830",
        "tt0137523",
        "tt0120737",
        "tt0088763",
        "tt0076759",
        "tt0073195",
        "tt0080684",
      ];
      const results = await Promise.all(
        ids.map((id) => fetch(buildUrl({ i: id })).then((r) => r.json()))
      );
      const normalized = results
        .filter((r) => r && r.Response !== "False")
        .map((r) => ({
          id: r.imdbID,
          title: r.Title,
          poster: r.Poster && r.Poster !== "N/A" ? r.Poster : "/logo192.png",
          year: r.Year || "",
          rating: r.imdbRating ? parseFloat(r.imdbRating) : 0,
          plot: r.Plot || "",
        }))
        .sort((a, b) => b.rating - a.rating);

      setMovies(normalized);
      setMode("recommended");
      setSelected(null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadRecommended();
  }, []);

  function goHome() {
    setQuery("");
    setSelected(null);
    loadRecommended();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  

  async function handleMovieClick(imdbID) {
    setLoading(true);
    try {
      const res = await fetch(buildUrl({ i: imdbID }));
      const r = await res.json();
      if (r && r.Response !== "False") {
        setSelected({
          id: r.imdbID,
          title: r.Title,
          poster: r.Poster && r.Poster !== "N/A" ? r.Poster : "/logo192.png",
          year: r.Year || "",
          rating: r.imdbRating ? parseFloat(r.imdbRating) : 0,
          plot: r.Plot || "No description available.",
        });
        setMode("details");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(term) {
    const q = (term ?? query).trim();
    if (!q) return;
    setLoading(true);
    setQuery(q);
    setMode("search");
    setSelected(null);
    try {
      const res = await fetch(
        buildUrl({ s: term.trim(), type: "movie", page: 1 })
      );
      const data = await res.json();
      const list = (data.Search || []).map((r) => ({
        id: r.imdbID,
        title: r.Title,
        poster: r.Poster && r.Poster !== "N/A" ? r.Poster : "/logo192.png",
        year: r.Year || "",
        rating: 0,
      }));
      setMovies(list);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="nav">
        <div className="nav__wrapper">
          <div className="logo">
            <img className="logo__img" src={logo} alt="Movie Search" />
          </div>

          <div className="nav__links">
            <button
              type="button"
              className="nav__link nav__btn"
              onClick={goHome}
            >
              Home
            </button>
            <a className="btn-login" href="#login">
              Login
            </a>
          </div>
        </div>

        <div className="overlay" style={{ backgroundImage: `url(${hero})` }} />
      </div>
      <div className="content-wrapper">
        <h1>Find Your Movie</h1>

        <SearchBar value={query} setValue={setQuery} onSearch={handleSearch} />
      </div>

      <section className="recs">
        <h2 className="recs__title">
          {mode === "recommended"
            ? "Top 10 Recommended"
            : `Results for "${query}"`}
        </h2>

        {loading ? (
          <div className="recs__status">Loading…</div>
        ) : (
          <MoviesGrid movies={movies} onSelect={handleMovieClick} />
        )}

        {selected && (
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelected(null);
            }}
          >
            <div className="modal__panel">
              <button
                className="modal__close"
                aria-label="Close details"
                title="Close"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
              <div className="modal__content">
                <img
                  className="modal__poster"
                  src={selected.poster}
                  alt={selected.title}
                />
                <div className="modal__info">
                  <h2>{selected.title}</h2>
                  <p className="modal__meta">
                    <strong>Year:</strong> {selected.year} &nbsp;·&nbsp;{" "}
                    <strong>IMDb:</strong> {selected.rating || "N/A"}
                  </p>
                  <p className="modal__plot">{selected.plot}</p>
                  <button className="watch-btn" type="button">
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
