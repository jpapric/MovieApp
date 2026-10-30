import BASE_URL from "../../../config/apiBase";

export type Movies = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
};

type MoviesResponse = {
  results: Movies[];
};

export async function getMovies(signal?: AbortSignal): Promise<Movies[]> {
  const token = (
    import.meta as ImportMeta & { env: { VITE_ACCESS_TOKEN?: string } }
  ).env.VITE_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing token");
  }

  const url = new URL(`${BASE_URL}/discover/movie`);

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

  const data: MoviesResponse = await response.json();
  return data.results;
}
