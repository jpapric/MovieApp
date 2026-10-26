import { Button, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthProvider";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header
      className="posts-header"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 24px",
        background:
          "radial-gradient(ellipse at top, #263a5e 0%, #101827 70%, #090d15 100%)",
      }}
    >
      {!user && (
        <Link to="/" style={{ textDecoration: "none", padding: "12px 24px" }}>
          <Typography.Title level={4} style={{ margin: 0, color: "#fff" }}>
            Cinemax
          </Typography.Title>
        </Link>
      )}

      {user && (
        <>
          <div style={{ padding: "12px 24px" }}>
            <Button type="link" onClick={handleLogout}>
              <Typography.Title level={4} style={{ margin: 0, color: "#fff" }}>
                Logout
              </Typography.Title>
            </Button>
          </div>
        </>
      )}
    </header>
  );
}
