import { useState, useEffect } from "react";
import { getSeries } from "../api/getSeries";
import type { Series } from "../api/getSeries";
import SeriesListView from "./SeriesListView";

export default function SeriesList() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");

  const filteredSeries = series.filter((tv) =>
    tv.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    const controller = new AbortController();
    async function loadSeries() {
      try {
        setLoading(true);
        setError(null);

        const result = await getSeries(controller.signal);
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
    }
    void loadSeries();
    return () => controller.abort();
  }, []);

  return (
    <SeriesListView
      loading={loading}
      error={error}
      series={filteredSeries}
      query={query}
      onQueryChange={setQuery}
    />
  );
}
