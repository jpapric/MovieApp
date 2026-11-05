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
} from "antd";
import { Link, useLocation } from "react-router-dom";
import type { Series } from "../api/getSeries";
import type { SeriesGenres } from "../api/getSeriesGenres";
import { StarOutlined, StarFilled } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

type SeriesListViewProps = {
  loading: boolean;
  error: string | null;
  series: Series[];
  genres: SeriesGenres[];
  selectedGenreId: number | null;
  query: string;
  onQueryChange: (value: string) => void;
  onGenreChange: (id: number | null) => void;
  favoriteSeriesIds: Set<number>;
  onFavoriteToggle: (tv: Series) => void;
};

export default function SeriesListView({
  loading,
  error,
  series,
  genres,
  selectedGenreId,
  query,
  onQueryChange,
  onGenreChange,
  favoriteSeriesIds,
  onFavoriteToggle,
}: SeriesListViewProps) {
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
          </Col>

          <Col xs={24} md={18}>
            <Input
              style={{
                width: "100%",
                padding: "10px",
              }}
              placeholder="Search series"
              allowClear
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />

            {error ? (
              <p role="alert">Error: {error}</p>
            ) : loading ? (
              <Spin tip="Loading series..." />
            ) : series.length === 0 ? (
              <Empty
                description={
                  query.trim()
                    ? "No series match your search"
                    : "No series found"
                }
              />
            ) : (
              <List
                grid={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
                dataSource={series}
                renderItem={(tv) => (
                  <List.Item>
                    <Link
                      to={`/tv/${tv.id}`}
                      state={{ from: location.pathname + location.search }}
                    >
                      <Card hoverable>
                        <Row gutter={16} wrap={false} align="top">
                          <Col flex="110px" style={{ paddingRight: "15px" }}>
                            {tv.poster_path ? (
                              <Image
                                preview={false}
                                src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                                alt={`Series poster ${tv.name}`}
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
                                  {tv.name}
                                </Title>

                                <Button
                                  type="text"
                                  aria-pressed={favoriteSeriesIds.has(tv.id)}
                                  icon={
                                    favoriteSeriesIds.has(tv.id) ? (
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
                                    onFavoriteToggle(tv);
                                  }}
                                />
                              </div>
                              <Text type="secondary">
                                {tv.first_air_date?.slice(0, 4) ||
                                  "Year unknown"}
                              </Text>

                              <Tag color="gold">
                                ★ {tv.vote_average.toFixed(1)} / 10
                              </Tag>

                              <Paragraph
                                type="secondary"
                                ellipsis={{ rows: 3 }}
                              >
                                {tv.overview || "Overview unavailable."}
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
          </Col>
        </Row>
      </main>
    </>
  );
}
