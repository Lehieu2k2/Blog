import { Button, Form, Image, Input, message, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../../assets/images/background.jpg";
import logo from "../../assets/images/logo.png";
import {
  handleCreateApi,
  setCookie,
  type LoginRequest,
  type LoginResponse,
} from "../../config";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginRequest) => {
    try {
      setLoading(true);
      const data = await handleCreateApi<LoginResponse>({
        data: values,
        url: "/auth/login",
      });
      if (data?.access_token) {
        message.success("Login successfully");
        setCookie("access_token", data.access_token);
        if (data.refresh_token) {
          setCookie("refresh_token", data.refresh_token);
        }
        setCookie("authToken", "Bearer " + data.access_token);
        navigate("/");
      } else {
        message.error("Login failed");
      }
    } catch (error) {
      message.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-20 bg-cover"
        style={{ backgroundImage: `url(${background})` }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl backdrop-blur-lg border border-white/20 shadow-2xl bg-white/10">
        <div className="text-center mb-8">
          <div className="mb-6">
            <Image
              src={logo}
              alt="Logo"
              width={80}
              height={80}
              className="mx-auto rounded-full border-2 border-white/30 shadow-lg"
              preview={false}
            />
          </div>
          <Typography.Title
            level={2}
            className="!text-white !font-bold !mb-2 !mt-0"
          >
            Login
          </Typography.Title>
        </div>

        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input
              size="large"
              placeholder="Username"
              className="!bg-white/20 !border-white/30 !text-white placeholder:!text-white/70"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              className="!bg-white/20 !border-white/30 !text-white placeholder:!text-white/70"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
              }}
            />
          </Form.Item>

          <Form.Item className="mb-4">
            <Button
              loading={loading}
              size="large"
              type="primary"
              htmlType="submit"
              block
              className="h-12 rounded-lg font-semibold border-none shadow-lg"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Typography.Text className="text-white/80">
            Don't have an account?{" "}
            <Typography.Link
              href="#"
              className="text-white underline hover:text-white/80"
            >
              Register
            </Typography.Link>
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
