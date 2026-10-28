import {
  Empty,
  List,
  Card,
  Typography,
  Image,
  Tag,
  Space,
  Row,
  Col,
  Input,
} from "antd";
import { Link } from "react-router-dom";
import type { Movies } from "../api/getMovies";
const { Title, Text, Paragraph } = Typography;

type MoviesListViewProps = {
  loading: boolean;
  error: string | null;
  movies: Movies[];
  query: string;
  onQueryChange: (value: string) => void;
};

export default function MoviesListView({
  loading,
  error,
  movies,
  query,
  onQueryChange,
}: MoviesListViewProps) {
  if (loading) {
    return <p>Loading movies...</p>;
  }
  if (error) {
    return <p role="alert">Error:{error}</p>;
  }

  return (
    <>
      <main>
        <Space.Compact
          size="large"
          style={{
            padding: "15px",
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Input
            style={{ width: "700px" }}
            placeholder="Search movies"
            allowClear
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </Space.Compact>
        {movies.length === 0 ? (
          <Empty description="No movies available" />
        ) : (
          <List
            grid={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
            dataSource={movies}
            renderItem={(movie) => (
              <List.Item>
                <Link to={`/movies/${movie.id}`}>
                  <Card hoverable>
                    <Row gutter={16} wrap={false} align="top">
                      <Col flex="110px" style={{ paddingRight: "15px" }}>
                        {movie.poster_path ? (
                          <Image
                            preview={false}
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={`Movie poster ${movie.title}`}
                            width={110}
                            height={165}
                            style={{ objectFit: "cover", borderRadius: 8 }}
                          />
                        ) : (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No poster"
                          />
                        )}
                      </Col>

                      <Col
                        flex="auto"
                        style={{ minWidth: 0, paddingLeft: "15px" }}
                      >
                        <Space direction="vertical" size="small">
                          <Title level={5} style={{ margin: 0 }}>
                            {movie.title}
                          </Title>

                          <Text type="secondary">
                            {movie.release_date?.slice(0, 4) || "Year unknown"}
                          </Text>

                          <Tag color="gold">
                            ★ {movie.vote_average.toFixed(1)} / 10
                          </Tag>

                          <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                            {movie.overview || "Overview unavailable."}
                          </Paragraph>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </Link>
              </List.Item>
            )}
          />
        )}
      </main>
    </>
  );
}
