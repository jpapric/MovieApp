import { Tabs, Typography } from "antd";
import MoviesList from "../movies/components/MoviesList";
import SeriesList from "../series/components/SeriesList";

const { Title, Text } = Typography;

export default function CatalogPage() {
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
        size="large"
        centered
        items={[
          { key: "movies", label: "Movies", children: <MoviesList /> },
          { key: "series", label: "Series", children: <SeriesList /> },
        ]}
      />
    </div>
  );
}
