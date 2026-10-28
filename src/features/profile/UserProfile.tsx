import { Link, useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useAuth } from "../auth/AuthProvider";

export default function UserProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>User profile</h1>
        <Link to="/">
          <Button onClick={handleLogout} icon={<LogoutOutlined />}>
            Logout
          </Button>
        </Link>
      </div>
    </>
  );
}
