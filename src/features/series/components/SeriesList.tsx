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

  const pageValue = Number(searchParams.get("seriesPage"));
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;

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
    const controller = new AbortController();

    const timeoutId = window.setTimeout(
      async () => {
        try {
          setLoading(true);
          setError(null);

          const result = query.trim()
            ? await getSeriesSearch(query, page, controller.signal)
            : await getSeries(page, selectedGenreId, controller.signal);

          setSeries(result.results);
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

  const displayedSeries =
    query.trim() && selectedGenreId !== null
      ? series.filter((tv) => tv.genre_ids.includes(selectedGenreId))
      : series;

  return (
    <>
      {contextHolder}
      <SeriesListView
        loading={loading}
        error={error}
        series={displayedSeries}
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
