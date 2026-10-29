import BASE_URL from "../../../config/apiBase";
import type { Series } from "./getSeries";

type SearchSeriesResponse = {
  results: Series[];
};

export async function getSeriesSearch(
  query: string,
  signal?: AbortSignal,
): Promise<Series[]> {
  const token = (
    import.meta as ImportMeta & { env: { VITE_ACCESS_TOKEN?: string } }
  ).env.VITE_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing token!");
  }

  const url = new URL(`${BASE_URL}/search/tv`);
  url.searchParams.set("query", query.trim());

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Series search fetch failed (${response.status}).`);
  }

  const data: SearchSeriesResponse = await response.json();
  return data.results;
}
