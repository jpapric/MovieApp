import BASE_URL from "../../../config/apiBase";

export type MovieGenres = {
  id: number;
  name: string;
};

type MovieGenresResponse = {
  genres: MovieGenres[];
};

export async function getMovieGenres(
  signal?: AbortSignal,
): Promise<MovieGenres[]> {
  const token = (
    import.meta as ImportMeta & { env: { VITE_ACCESS_TOKEN?: string } }
  ).env.VITE_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing token");
  }

  const url = new URL(`${BASE_URL}/genre/movie/list`);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Movie genres fetch failed (${response.status})`);
  }

  const data: MovieGenresResponse = await response.json();
  return data.genres;
}
