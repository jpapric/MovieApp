import { useState, useEffect } from "react";
import { getMovies } from "../api/getMovies";
import type { Movies } from "../api/getMovies";
import type { MovieGenres } from "../api/getMovieGenres";
import MoviesListView from "./MoviesListView";
import { getMoviesSearch } from "../api/getMoviesSearch";
import { getMovieGenres } from "../api/getMovieGenres";

type MoviesListProps = {
  query: string;
  onQueryChange: (value: string) => void;
  selectedGenreId: number | null;
  onGenreChange: (id: number | null) => void;
};

export default function MoviesList({
  query,
  onQueryChange,
  selectedGenreId,
  onGenreChange,
}: MoviesListProps) {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<MovieGenres[]>([]);

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

  useEffect(() => {
    const controller = new AbortController();

    getMovieGenres(controller.signal)
      .then(setGenres)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setError(error instanceof Error ? error.message : "Unknown error");
      });

    return () => controller.abort();
  }, []);

  const filteredMovies =
    selectedGenreId === null
      ? movies
      : movies.filter((movie) => movie.genre_ids.includes(selectedGenreId));

  return (
    <MoviesListView
      loading={loading}
      error={error}
      movies={filteredMovies}
      genres={genres}
      selectedGenreId={selectedGenreId}
      query={query}
      onQueryChange={onQueryChange}
      onGenreChange={onGenreChange}
    />
  );
}
