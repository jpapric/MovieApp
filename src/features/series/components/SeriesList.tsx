import { useState, useEffect } from "react";
import { getSeries } from "../api/getSeries";
import type { Series } from "../api/getSeries";
import type { SeriesGenres } from "../api/getSeriesGenres";
import SeriesListView from "./SeriesListView";
import { getSeriesSearch } from "../api/getSeriesSearch";
import { getSeriesGenres } from "../api/getSeriesGenres";
import { useAuth } from "../../auth/AuthProvider";
import { message } from "antd";

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

  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = window.setTimeout(
      async () => {
        try {
          setLoading(true);
          setError(null);

          const result = query.trim()
            ? await getSeriesSearch(query, controller.signal)
            : await getSeries(controller.signal);

          setSeries(result);
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
      query.trim() ? 500 : 0,
    );

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

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

  const filteredSeries =
    selectedGenreId === null
      ? series
      : series.filter((tv) => tv.genre_ids.includes(selectedGenreId));

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
        series={filteredSeries}
        genres={genres}
        selectedGenreId={selectedGenreId}
        query={query}
        onQueryChange={onQueryChange}
        onGenreChange={onGenreChange}
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
