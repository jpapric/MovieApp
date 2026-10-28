import type { Series } from "../api/getSeries";
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
const { Title, Text, Paragraph } = Typography;

type SeriesListViewProps = {
  loading: boolean;
  error: string | null;
  series: Series[];
  query: string;
  onQueryChange: (value: string) => void;
};

export default function SeriesListView({
  loading,
  error,
  series,
  query,
  onQueryChange,
}: SeriesListViewProps) {
  if (loading) {
    return <p>Loading series...</p>;
  }
  if (error) {
    return <p role="alert">Error: {error}</p>;
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
            placeholder="Search series"
            allowClear
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </Space.Compact>
        {series.length === 0 ? (
          <Empty
            description={
              query.trim() ? "No series match your search" : "No series found"
            }
          />
        ) : (
          <List
            grid={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
            dataSource={series}
            renderItem={(tv) => (
              <List.Item>
                <Link to={`/tv/${tv.id}`}>
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
                            {tv.name}
                          </Title>
                          <Text type="secondary">
                            {tv.first_air_date?.slice(0, 4) || "Year unknown"}
                          </Text>

                          <Tag color="gold">
                            ★ {tv.vote_average.toFixed(1)} / 10
                          </Tag>

                          <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
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
      </main>
    </>
  );
}
