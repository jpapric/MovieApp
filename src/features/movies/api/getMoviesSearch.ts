import BASE_URL from "../../../config/apiBase";
import type { Movies } from "./getMovies";

type SearchMoviesResponse = {
  results: Movies[];
};

export async function getMoviesSearch(
  query: string,
  signal?: AbortSignal,
): Promise<Movies[]> {
  const token = (
    import.meta as ImportMeta & { env: { VITE_ACCESS_TOKEN?: string } }
  ).env.VITE_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing token!");
  }

  const url = new URL(`${BASE_URL}/search/movie`);
  url.searchParams.set("query", query.trim());

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Movie search fetch failed (${response.status}).`);
  }

  const data: SearchMoviesResponse = await response.json();
  return data.results;
}
