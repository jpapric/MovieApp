import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSeriesById } from "../api/getSeriesById";
import type { TvDetails } from "../api/getSeriesById";
import SeriesDetailsView from "./SeriesDetailsView";

export default function SeriesDetails() {
  const { tvDetailsId } = useParams();
  const [tvDetails, setTvDetails] = useState<TvDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSeriesById() {
      if (!tvDetailsId) {
        setError("Series ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getSeriesById(tvDetailsId, controller.signal);
        setTvDetails(result);
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

    void loadSeriesById();

    return () => controller.abort();
  }, [tvDetailsId]);

  return (
    <SeriesDetailsView loading={loading} error={error} tvDetails={tvDetails} />
  );
}
