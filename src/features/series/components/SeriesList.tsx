import { useState, useEffect } from "react";
import { getSeries } from "../api/getSeries";
import type { Series } from "../api/getSeries";
import type { SeriesGenres } from "../api/getSeriesGenres";
import SeriesListView from "./SeriesListView";
import { getSeriesSearch } from "../api/getSeriesSearch";
import { getSeriesGenres } from "../api/getSeriesGenres";

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

  return (
    <SeriesListView
      loading={loading}
      error={error}
      series={filteredSeries}
      genres={genres}
      selectedGenreId={selectedGenreId}
      query={query}
      onQueryChange={onQueryChange}
      onGenreChange={onGenreChange}
    />
  );
}
