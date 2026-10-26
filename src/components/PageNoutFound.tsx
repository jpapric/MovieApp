import { Button } from "antd";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Page not found</h1>
      <Link
        to="/movies"
        style={{ textDecoration: "none", padding: "12px 24px" }}
      >
        <Button style={{ margin: 0, color: "#1677ff" }}>Back to movies</Button>
      </Link>
    </div>
  );
}
