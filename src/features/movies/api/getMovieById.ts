import BASE_URL from "../../../config/apiBase";

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  original_language: string;
  vote_count: number;
  credits: {
    cast: { id: number; name: string; character: string }[];
  };
};

export async function getMovieById(
  movieId: string,
  signal?: AbortSignal,
): Promise<Movie> {
  const token = (
    import.meta as ImportMeta & { env: { VITE_ACCESS_TOKEN?: string } }
  ).env.VITE_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing token");
  }

  if (!/^\d+$/.test(movieId)) {
    throw new Error("Invalid movie ID");
  }

  const url = new URL(`${BASE_URL}/movie/${movieId}`);
  url.searchParams.set("append_to_response", "credits");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Movie fetch failed (${response.status}).`);
  }

  return (await response.json()) as Movie;
}
