import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById, type Movie } from "../api/getMovieById";

import MovieDetailsView from "./MovieDetailsView";

export default function MovieDetails() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovieById() {
      if (!movieId) {
        setError("Movie ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getMovieById(movieId, controller.signal);
        setMovie(result);
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

    void loadMovieById();

    return () => controller.abort();
  }, [movieId]);

  return <MovieDetailsView loading={loading} error={error} movie={movie} />;
}
