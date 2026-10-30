import { Tabs, Typography } from "antd";
import MoviesList from "../movies/components/MoviesList";
import SeriesList from "../series/components/SeriesList";
import { useSearchParams } from "react-router";

const { Title, Text } = Typography;

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "movies";
  const movieQuery = searchParams.get("movieQuery") ?? "";
  const seriesQuery = searchParams.get("seriesQuery") ?? "";

  const movieGenreId = Number(searchParams.get("movieGenreId")) || null;
  const seriesGenreId = Number(searchParams.get("seriesGenreId")) || null;

  function updateCatalogState(key: string, value: string) {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "40px auto",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          padding: "36px 40px",
          marginBottom: 28,
          borderRadius: 16,
          color: "#fff",
          background:
            "linear-gradient(120deg, #263a5e 0%, #101827 65%, #090d15 100%)",
        }}
      >
        <Text style={{ color: "#b9c9e8" }}>CINEMAX</Text>
        <Title level={1} style={{ color: "#fff", margin: "8px 0" }}>
          Discover movies and series
        </Title>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(tab) => updateCatalogState("tab", tab)}
        items={[
          {
            key: "movies",
            label: "Movies",
            children: (
              <MoviesList
                query={movieQuery}
                selectedGenreId={movieGenreId}
                onGenreChange={(id) =>
                  updateCatalogState(
                    "movieGenreId",
                    id === null ? "" : String(id),
                  )
                }
                onQueryChange={(value) =>
                  updateCatalogState("movieQuery", value)
                }
              />
            ),
          },
          {
            key: "tv",
            label: "Series",
            children: (
              <SeriesList
                query={seriesQuery}
                selectedGenreId={seriesGenreId}
                onGenreChange={(id) =>
                  updateCatalogState(
                    "seriesGenreId",
                    id === null ? "" : String(id),
                  )
                }
                onQueryChange={(value) =>
                  updateCatalogState("seriesQuery", value)
                }
              />
            ),
          },
        ]}
      />
    </div>
  );
}
