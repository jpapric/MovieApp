import { useState, useEffect } from "react";
import { getMovies } from "../api/getMovies";
import type { Movies } from "../api/getMovies";
import MoviesListView from "./MoviesListView";
import { getMoviesSearch } from "../api/getMoviesSearch";

type MoviesListProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export default function MoviesList({ query, onQueryChange }: MoviesListProps) {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = window.setTimeout(
      async () => {
        try {
          setLoading(true);
          setError(null);

          const result = query.trim()
            ? await getMoviesSearch(query, controller.signal)
            : await getMovies(controller.signal);

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
      },
      query.trim() ? 300 : 0,
    );

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  return (
    <MoviesListView
      loading={loading}
      error={error}
      movies={movies}
      query={query}
      onQueryChange={onQueryChange}
    />
  );
}
