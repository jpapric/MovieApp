import { Alert, Button, Card, Form, Input, Space, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

export default function Loginform({
  onSubmit,
  error,
  isLoading,
}: {
  onSubmit: (values: { username: string; password: string }) => void;
  error?: string | null;
  isLoading?: boolean;
}) {
  return (
    <main
      style={{
        minHeight: "95vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(ellipse at top, #263a5e 0%, #101827 70%, #090d15 100%)",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(17, 25, 40, 0.92)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
        }}
        styles={{ body: { padding: 36 } }}
      >
        <Space
          direction="vertical"
          size={8}
          style={{ width: "100%", marginBottom: 28 }}
        >
          <Title level={2} style={{ color: "#fff", margin: 0 }}>
            Welcome back!
          </Title>

          <Text
            style={{
              color: "#8fbaff",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Login to explore new movies.
          </Text>
        </Space>

        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          requiredMark={false}
          size="large"
          style={{ width: 360 }}
        >
          <Form.Item
            label={<span style={{ color: "#e5eaf2" }}>Username</span>}
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#e5eaf2" }}>Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          {error && (
            <Alert
              type="error"
              showIcon
              message={error}
              style={{ marginBottom: 20, borderRadius: 8 }}
            />
          )}

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={{
                height: 48,
                borderRadius: 10,
                fontWeight: 600,
                background: "#8fbaff",
              }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </main>
  );
}
