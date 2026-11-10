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
  Spin,
  Select,
  Button,
  Pagination,
} from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import type { Movies } from "../api/getMovies";
import type { MovieGenres } from "../api/getMovieGenres";

const { Title, Text, Paragraph } = Typography;

type MoviesListViewProps = {
  loading: boolean;
  error: string | null;
  movies: Movies[];
  genres: MovieGenres[];
  selectedGenreId: number | null;
  query: string;
  onQueryChange: (value: string) => void;
  onGenreChange: (id: number | null) => void;
  favoriteMovieIds: Set<number>;
  onFavoriteToggle: (movie: Movies) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function MoviesListView({
  loading,
  error,
  movies,
  genres,
  selectedGenreId,
  query,
  onQueryChange,
  onGenreChange,
  favoriteMovieIds,
  onFavoriteToggle,
  page,
  totalPages,
  onPageChange,
}: MoviesListViewProps) {
  const location = useLocation();

  return (
    <>
      <main>
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} md={6}>
            <Select
              allowClear
              style={{ width: "100%", marginTop: 12 }}
              placeholder="Select genre"
              value={selectedGenreId ?? undefined}
              options={genres.map((genre) => ({
                value: genre.id,
                label: genre.name,
              }))}
              onChange={(value: number | undefined) =>
                onGenreChange(value ?? null)
              }
            />
            <Text type="secondary">
              Search and genre filtering are separate filters, selecting one
              clears the other.
            </Text>
          </Col>

          <Col xs={24} md={18}>
            <Input
              style={{
                width: "100%",
                padding: "10px",
              }}
              placeholder="Search movies"
              allowClear
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />

            {error ? (
              <p role="alert">Error:{error}</p>
            ) : loading ? (
              <Spin tip="Loading movies..." />
            ) : movies.length === 0 ? (
              <Empty
                description={
                  query.trim()
                    ? "No movies match your search"
                    : "No movies found"
                }
              />
            ) : (
              <List
                grid={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
                dataSource={movies}
                renderItem={(movie) => (
                  <List.Item>
                    <Link
                      to={`/movies/${movie.id}`}
                      state={{ from: location.pathname + location.search }}
                    >
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
                                style={{
                                  objectFit: "cover",
                                  borderRadius: 8,
                                }}
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
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Title level={5} style={{ margin: 0 }}>
                                  {movie.title}
                                </Title>

                                <Button
                                  type="text"
                                  aria-pressed={favoriteMovieIds.has(movie.id)}
                                  icon={
                                    favoriteMovieIds.has(movie.id) ? (
                                      <StarFilled
                                        style={{ color: "#fadb14" }}
                                      />
                                    ) : (
                                      <StarOutlined />
                                    )
                                  }
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    onFavoriteToggle(movie);
                                  }}
                                />
                              </div>

                              <Text type="secondary">
                                {movie.release_date?.slice(0, 4) ||
                                  "Year unknown"}
                              </Text>

                              <Tag color="gold">
                                ★ {movie.vote_average.toFixed(1)} / 10
                              </Tag>

                              <Paragraph
                                type="secondary"
                                ellipsis={{ rows: 3 }}
                              >
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
            {!loading && !error && totalPages > 1 && (
              <Pagination
                current={page}
                pageSize={1}
                total={totalPages}
                onChange={onPageChange}
                showSizeChanger={false}
                style={{ marginTop: 24, textAlign: "center" }}
              />
            )}
          </Col>
        </Row>
      </main>
    </>
  );
}
