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
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import type { TvDetails } from "../api/getSeriesById";

const { Title, Text, Paragraph } = Typography;

type SeriesDetailsViewProp = {
  loading: boolean;
  error: string | null;
  tvDetails: TvDetails | null;
};

export default function SeriesDetailsView({
  loading,
  error,
  tvDetails,
}: SeriesDetailsViewProp) {
  const location = useLocation();
  const returnTo = location.state?.from ?? "/catalog";

  if (loading) {
    <Spin spinning={loading} tip="Loading series..." />;
  }

  if (error) {
    return <p role="alert">Error: {error}</p>;
  }

  if (!tvDetails) {
    return <Empty description="Series not found" />;
  }

  return (
    <>
      <main style={{ maxWidth: 1000, margin: "32px auto", padding: "0 16px" }}>
        <Link to={returnTo}>
          <Button icon={<ArrowLeftOutlined />}>Back to catalog</Button>
        </Link>

        <Card>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={9} md={8}>
              {tvDetails.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${tvDetails.poster_path}`}
                  alt={`Movie poster ${tvDetails.name}`}
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
                    {tvDetails.name}
                  </Title>
                  {tvDetails.tagline && (
                    <Text type="secondary">{tvDetails.tagline}</Text>
                  )}
                </div>

                <Space wrap>
                  {tvDetails.genres?.map((genre) => (
                    <Tag key={genre.id} color="blue">
                      {genre.name}
                    </Tag>
                  ))}
                </Space>

                <Space>
                  <Rate disabled allowHalf value={tvDetails.vote_average / 2} />
                  <Text strong>{tvDetails.vote_average.toFixed(1)} / 10</Text>
                  <Text type="secondary">({tvDetails.vote_count} votes)</Text>
                </Space>
                <div>
                  <Title level={5}>Overview</Title>
                  <Paragraph>
                    {tvDetails.overview || "Overview unavailable."}
                  </Paragraph>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>
        <Card title="Details" style={{ marginTop: 16 }}>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
            <Descriptions.Item label="Seasons">
              {tvDetails.number_of_seasons ?? "Unknown"}
            </Descriptions.Item>
            <Descriptions.Item label="Episodes">
              {tvDetails.number_of_episodes ?? "Unknown"}
            </Descriptions.Item>
            <Descriptions.Item label="Release date">
              {tvDetails.first_air_date || "Unknown."}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {tvDetails.status || "Unknown"}
            </Descriptions.Item>
            <Descriptions.Item label="Language">
              {tvDetails.original_language || "Unknown"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {tvDetails.credits?.cast?.length > 0 && (
          <Card title="Cast" style={{ marginTop: 16 }}>
            <Space wrap>
              {tvDetails.credits.cast.slice(0, 5).map((actor) => (
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
