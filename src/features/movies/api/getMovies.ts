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

export type MoviesPage = {
  results: Movies[];
  total_pages: number;
};

export async function getMovies(
  page: number,
  genreId: number | null,
  signal?: AbortSignal,
): Promise<MoviesPage> {
  const token = (
    import.meta as ImportMeta & { env: { VITE_ACCESS_TOKEN?: string } }
  ).env.VITE_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing token");
  }

  const url = new URL(`${BASE_URL}/discover/movie`);
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
    throw new Error(`Movie fetch failed (${response.status}).`);
  }

  return response.json();
}
