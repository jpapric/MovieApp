import { useState, useEffect } from "react";
import { getMovies } from "../api/getMovies";
import type { Movies } from "../api/getMovies";
import type { MovieGenres } from "../api/getMovieGenres";
import MoviesListView from "./MoviesListView";
import { getMoviesSearch } from "../api/getMoviesSearch";
import { getMovieGenres } from "../api/getMovieGenres";
import { useAuth } from "../../auth/AuthProvider";
import { message } from "antd";
import { useSearchParams } from "react-router-dom";

const MAX_API_PAGES = 500;

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
  const { favoriteItems, toggleFavorite } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const pageValue = Number(searchParams.get("moviePage"));
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;

  function handlePageChange(nextPage: number) {
    const next = new URLSearchParams(searchParams);

    if (nextPage === 1) {
      next.delete("moviePage");
    } else {
      next.set("moviePage", String(nextPage));
    }

    setSearchParams(next, { replace: true });
  }

  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = window.setTimeout(
      async () => {
        try {
          setLoading(true);
          setError(null);

          const result = query.trim()
            ? await getMoviesSearch(query, page, controller.signal)
            : await getMovies(page, selectedGenreId, controller.signal);

          setMovies(result.results);
          setTotalPages(Math.min(result.total_pages, MAX_API_PAGES));
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
  }, [query, page, selectedGenreId]);

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

  function handleQueryChange(value: string) {
    onQueryChange(value);
  }

  function handleGenreChange(id: number | null) {
    onGenreChange(id);
  }

  function handleFavoriteToggle(movie: Movies) {
    const saved = toggleFavorite({ type: "movie", item: movie });

    if (!saved) {
      messageApi.error("Failed to save favorite. Try again.");
    }
  }

  const displayedMovies =
    query.trim() && selectedGenreId !== null
      ? movies.filter((movie) => movie.genre_ids.includes(selectedGenreId))
      : movies;

  return (
    <>
      {contextHolder}
      <MoviesListView
        loading={loading}
        error={error}
        movies={displayedMovies}
        genres={genres}
        selectedGenreId={selectedGenreId}
        query={query}
        onQueryChange={handleQueryChange}
        onGenreChange={handleGenreChange}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        favoriteMovieIds={
          new Set(
            favoriteItems
              .filter((favorite) => favorite.type === "movie")
              .map((favorite) => favorite.item.id),
          )
        }
        onFavoriteToggle={handleFavoriteToggle}
      />
    </>
  );
}
