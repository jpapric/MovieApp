import { useState, useEffect } from "react";
import { getSeries } from "../api/getSeries";
import type { Series } from "../api/getSeries";
import SeriesListView from "./SeriesListView";
import { getSeriesSearch } from "../api/getSeriesSearch";

type SeriesListProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export default function SeriesList({ query, onQueryChange }: SeriesListProps) {
  const [series, setSeries] = useState<Series[]>([]);
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

  return (
    <SeriesListView
      loading={loading}
      error={error}
      series={series}
      query={query}
      onQueryChange={onQueryChange}
    />
  );
}
