import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById } from "../api/getMovieById";
import type { Movie } from "../api/getMovieById";
import {
  Empty,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Rate,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

export default function MovieDetails() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovie() {
      if (!movieId) {
        setError("Movie ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getMovieById(movieId, controller.signal);
        setMovie(result);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadMovie();

    return () => controller.abort();
  }, [movieId]);

  if (loading) {
    return <p>Loading movie details...</p>;
  }

  if (error) {
    return <p role="alert">Error: {error}</p>;
  }

  if (!movie) {
    return <Empty description="Movie not found" />;
  }

  return (
    <>
      <main style={{ maxWidth: 1000, margin: "32px auto", padding: "0 16px" }}>
        <Link to="/movies">
          <Button icon={<ArrowLeftOutlined />}>Back to movies</Button>
        </Link>

        <Card>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={9} md={8}>
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`Movie poster ${movie.title}`}
                  width="100%"
                  style={{ borderRadius: 8 }}
                />
              ) : (
                <Card style={{ textAlign: "center" }}>
                  Poster not available.
                </Card>
              )}
            </Col>

            <Col xs={24} sm={15} md={16}>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div>
                  <Title level={2} style={{ margin: 0 }}>
                    {movie.title}
                  </Title>
                  {movie.tagline && (
                    <Text type="secondary">{movie.tagline}</Text>
                  )}
                </div>

                <Space wrap>
                  {movie.genres?.map((genre) => (
                    <Tag key={genre.id} color="blue">
                      {genre.name}
                    </Tag>
                  ))}
                </Space>

                <Space>
                  <Rate disabled allowHalf value={movie.vote_average / 2} />
                  <Text strong>{movie.vote_average.toFixed(1)} / 10</Text>
                  <Text type="secondary">({movie.vote_count} votes)</Text>
                </Space>
                <div>
                  <Title level={5}>Overview</Title>
                  <Paragraph>
                    {movie.overview || "Overview unavailable."}
                  </Paragraph>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>
        <Card title="Details" style={{ marginTop: 16 }}>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
            <Descriptions.Item label="Release date">
              {movie.release_date || "Unknown."}
            </Descriptions.Item>
            <Descriptions.Item label="Runtime">
              {movie.runtime ? `${movie.runtime} min` : "Unknown"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {movie.status || "Unknown"}
            </Descriptions.Item>
            <Descriptions.Item label="Language">
              {movie.original_language || "Unknown"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {movie.credits?.cast?.length > 0 && (
          <Card title="Cast" style={{ marginTop: 16 }}>
            <Space wrap>
              {movie.credits.cast.slice(0, 5).map((actor) => (
                <Tag key={`${actor.name}-${actor.character}`}>
                  {actor.name} — {actor.character}
                </Tag>
              ))}
            </Space>
          </Card>
        )}
      </main>
    </>
  );
}
