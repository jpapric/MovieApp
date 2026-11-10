import { useState, useEffect } from "react";
import { getSeries } from "../api/getSeries";
import type { Series } from "../api/getSeries";
import type { SeriesGenres } from "../api/getSeriesGenres";
import SeriesListView from "./SeriesListView";
import { getSeriesSearch } from "../api/getSeriesSearch";
import { getSeriesGenres } from "../api/getSeriesGenres";
import { useAuth } from "../../auth/AuthProvider";
import { message } from "antd";
import { useSearchParams } from "react-router-dom";

const MAX_API_PAGES = 500;

type SeriesListProps = {
  query: string;
  onQueryChange: (value: string) => void;
  selectedGenreId: number | null;
  onGenreChange: (id: number | null) => void;
};

export default function SeriesList({
  query,
  onQueryChange,
  selectedGenreId,
  onGenreChange,
}: SeriesListProps) {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<SeriesGenres[]>([]);
  const { favoriteItems, toggleFavorite } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const rawPage = searchParams.get("seriesPage");
  const parsedPage = rawPage === null ? 1 : Number(rawPage);

  const isValidPage =
    rawPage === null ||
    (/^[1-9]\d*$/.test(rawPage) && Number.isSafeInteger(parsedPage));

  const page = isValidPage ? parsedPage : 1;
  const requestPage = Math.min(page, MAX_API_PAGES);

  function handlePageChange(nextPage: number) {
    const next = new URLSearchParams(searchParams);

    if (nextPage === 1) {
      next.delete("seriesPage");
    } else {
      next.set("seriesPage", String(nextPage));
    }

    setSearchParams(next, { replace: true });
  }

  useEffect(() => {
    if (rawPage === null || isValidPage) return;

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("seriesPage");
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
            ? await getSeriesSearch(query, requestPage, controller.signal)
            : await getSeries(requestPage, selectedGenreId, controller.signal);

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
                  next.delete("seriesPage");
                } else {
                  next.set("seriesPage", String(validPage));
                }

                return next;
              },
              { replace: true },
            );

            redirecting = true;
            return;
          }

          setSeries(result.results);
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

    getSeriesGenres(controller.signal)
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

  function handleFavoriteToggle(tv: Series) {
    const saved = toggleFavorite({ type: "series", item: tv });

    if (!saved) {
      messageApi.error("Failed to save favorite. Try again.");
    }
  }

  return (
    <>
      {contextHolder}
      <SeriesListView
        loading={loading}
        error={error}
        series={series}
        genres={genres}
        selectedGenreId={selectedGenreId}
        query={query}
        onQueryChange={handleQueryChange}
        onGenreChange={handleGenreChange}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        favoriteSeriesIds={
          new Set(
            favoriteItems
              .filter((favorite) => favorite.type === "series")
              .map((favorite) => favorite.item.id),
          )
        }
        onFavoriteToggle={handleFavoriteToggle}
      />
    </>
  );
}
