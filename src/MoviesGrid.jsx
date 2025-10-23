export default function MoviesGrid({ movies, onSelect }) {
  return (
   <div className="recs__grid">
      {movies.map((m) => (
        <button
          key={m.id}
          className="recs__card recs__card--btn"
          title={m.title}
          onClick={() => onSelect(m.id)}
        >
          <img src={m.poster} alt={m.title} loading="lazy" />
          <div className="recs__meta">
            <h3 className="recs__name">{m.title}</h3>
            <span className="recs__score">{m.year}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
