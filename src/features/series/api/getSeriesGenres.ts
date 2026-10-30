import BASE_URL from "../../../config/apiBase";

export type SeriesGenres = {
  id: number;
  name: string;
};

type SeriesGenresResponse = {
  genres: SeriesGenres[];
};

export async function getSeriesGenres(
  signal?: AbortSignal,
): Promise<SeriesGenres[]> {
  const token = (
    import.meta as ImportMeta & { env: { VITE_ACCESS_TOKEN?: string } }
  ).env.VITE_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing token");
  }

  const url = new URL(`${BASE_URL}/genre/tv/list`);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Series genres fetch failed (${response.status})`);
  }

  const data: SeriesGenresResponse = await response.json();
  return data.genres;
}
