import BASE_URL from "../../../config/apiBase";

export type TvDetails = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  original_language: string;
  vote_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
  networks: { id: number; name: string; logo_path: string | null }[];
  created_by: { id: number; name: string; profile_path: string | null }[];
  credits: {
    cast: { id: number; name: string; character: string }[];
  };
};

export async function getSeriesById(
  seriesId: string,
  signal?: AbortSignal,
): Promise<TvDetails> {
  const token = (
    import.meta as ImportMeta & { env: { VITE_ACCESS_TOKEN?: string } }
  ).env.VITE_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing token");
  }

  if (!/^\d+$/.test(seriesId)) {
    throw new Error("Invalid series ID");
  }

  const url = new URL(`${BASE_URL}/tv/${seriesId}`);
  url.searchParams.set("append_to_response", "credits");

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

  return (await response.json()) as TvDetails;
}
