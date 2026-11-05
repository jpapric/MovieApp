import { Link, useNavigate } from "react-router-dom";
import { LogoutOutlined, DeleteOutlined } from "@ant-design/icons";
import { Empty, List, Card, Typography, Image, Button, message } from "antd";
import { useAuth } from "../auth/AuthProvider";
const { Title } = Typography;

export default function UserProfile() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { user, logout, favoriteItems, toggleFavorite } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        <Title level={2}>{user?.username}</Title>
        <Link to="/">
          <Button onClick={handleLogout} icon={<LogoutOutlined />}>
            Logout
          </Button>
        </Link>
      </div>
      <Title level={3}>Favourites</Title>

      {favoriteItems.length === 0 ? (
        <Empty>No favorites yet.</Empty>
      ) : (
        <div>
          <List
            grid={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
            dataSource={favoriteItems}
            renderItem={(favorite) => {
              const item = favorite.item;
              const title =
                favorite.type === "movie"
                  ? favorite.item.title
                  : favorite.item.name;
              const detailsPath = favorite.type === "movie" ? "movies" : "tv";

              return (
                <List.Item style={{ margin: "10px" }}>
                  <Link
                    to={`/${detailsPath}/${item.id}`}
                    state={{ from: location.pathname + location.search }}
                  >
                    <Card hoverable>
                      {item.poster_path ? (
                        <Image
                          preview={false}
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={`Poster: ${title}`}
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

                      <Title level={5} style={{ margin: 0 }}>
                        {title}
                      </Title>

                      <Button
                        type="link"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (!toggleFavorite(favorite)) {
                            messageApi.error(
                              "Failed to save favorite. Try again.",
                            );
                          }
                        }}
                      >
                        <DeleteOutlined />
                        Remove
                      </Button>
                    </Card>
                  </Link>
                </List.Item>
              );
            }}
          />
        </div>
      )}
    </>
  );
}
