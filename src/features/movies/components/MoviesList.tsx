import { useState, useEffect } from "react";
import { getPopularMovies } from "../api/getMovies";
import type { Movies } from "../api/getMovies";
import MoviesListView from "./MoviesListView";

export default function MoviesList() {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    const controller = new AbortController();
    async function loadMovies() {
      try {
        setLoading(true);
        setError(null);

        const result = await getPopularMovies(controller.signal);
        setMovies(result);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    void loadMovies();
    return () => controller.abort();
  }, []);

  return (
    <MoviesListView
      loading={loading}
      error={error}
      movies={filteredMovies}
      query={query}
      onQueryChange={setQuery}
    />
  );
}
