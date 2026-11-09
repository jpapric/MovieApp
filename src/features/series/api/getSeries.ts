import BASE_URL from "../../../config/apiBase";

export type Series = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
};

export type SeriesPage = {
  results: Series[];
  total_pages: number;
};

export async function getSeries(
  page: number,
  genreId: number | null,
  signal?: AbortSignal,
): Promise<SeriesPage> {
  const token = (
    import.meta as ImportMeta & { env: { VITE_ACCESS_TOKEN?: string } }
  ).env.VITE_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing token");
  }

  const url = new URL(`${BASE_URL}/discover/tv`);
  url.searchParams.set("page", String(page));

  if (genreId !== null) {
    url.searchParams.set("with_genres", String(genreId));
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Series fetch failed (${response.status}).`);
  }

  return response.json();
}
