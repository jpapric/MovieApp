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

  const rawPage = searchParams.get("moviePage");
  const parsedPage = rawPage === null ? 1 : Number(rawPage);

  const isValidPage =
    rawPage === null ||
    (/^[1-9]\d*$/.test(rawPage) && Number.isSafeInteger(parsedPage));

  const page = isValidPage ? parsedPage : 1;
  const requestPage = Math.min(page, MAX_API_PAGES);

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
    if (rawPage === null || isValidPage) return;

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("moviePage");
        return next;
      },
      { replace: true },
    );
  }, [rawPage, isValidPage, setSearchParams]);

  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = window.setTimeout(
      async () => {
        let redirecting = false;
        try {
          setLoading(true);
          setError(null);

          const result = query.trim()
            ? await getMoviesSearch(query, requestPage, controller.signal)
            : await getMovies(requestPage, selectedGenreId, controller.signal);

          const availablePages = Math.max(
            1,
            Math.min(result.total_pages, MAX_API_PAGES),
          );

          setTotalPages(availablePages);

          const validPage = Math.min(requestPage, availablePages);

          if (validPage !== page) {
            setSearchParams(
              (current) => {
                const next = new URLSearchParams(current);

                if (validPage === 1) {
                  next.delete("moviePage");
                } else {
                  next.set("moviePage", String(validPage));
                }

                return next;
              },
              { replace: true },
            );

            redirecting = true;
            return;
          }

          setMovies(result.results);
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return;
          }

          setError(error instanceof Error ? error.message : "Unknown error");
        } finally {
          if (!controller.signal.aborted && !redirecting) {
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

  return (
    <>
      {contextHolder}
      <MoviesListView
        loading={loading}
        error={error}
        movies={movies}
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
