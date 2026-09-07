import {
  App as AntApp,
  Button,
  Card,
  Form,
  Input,
  Typography,
  theme,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { storeCluster } from "../utils/clusterStorage";
import "../styles/ConnectClusterPage.css";

const { Title, Text } = Typography;

function ConnectClusterPage() {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [connecting, setConnecting] = useState(false);

  const {
    token: { colorPrimary, colorError, colorBgContainer },
  } = theme.useToken();

  const handleSubmit = async (values) => {
    setConnecting(true);

    try {
      // Temporary mock delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      storeCluster({
        id: Date.now(),
        name: values.name,
        address: values.address,
        namespace_count: 0,
        namespaces: [],
      });

      // Token is intentionally not stored locally.

      message.success("Cluster connected successfully.");
      navigate("/clusters");
    } catch (error) {
      message.error(error.message || "Could not connect to cluster.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <main className="connect-cluster-page">
      <header className="connect-cluster-header">
        <Title level={2}>Add New Cluster</Title>

        <Text type="secondary">
          Enter the connection details for your Kubernetes cluster.
        </Text>
      </header>

      <div
        className={`connect-card-shell ${
          connecting ? "connect-card-shell--loading" : ""
        }`}
        style={{
          "--connect-primary": colorPrimary,
          "--connect-error": colorError,
          "--connect-surface": colorBgContainer,
        }}
      >
        <Card title="Cluster Connection">
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Cluster Name"
              rules={[
                {
                  required: true,
                  message: "Enter a cluster name.",
                },
              ]}
            >
              <Input placeholder="production-cluster" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Cluster Address"
              rules={[
                {
                  required: true,
                  message: "Enter the cluster address.",
                },
              ]}
            >
              <Input placeholder="https://cluster.example.com" />
            </Form.Item>

            <Form.Item
              name="token"
              label="Token"
              rules={[
                {
                  required: true,
                  message: "Enter the cluster token.",
                },
              ]}
            >
              <Input.Password placeholder="Cluster token" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              icon={<LinkOutlined />}
              disabled={connecting}
            >
              Add Cluster
            </Button>
          </Form>
        </Card>
      </div>
    </main>
  );
}

export default ConnectClusterPage;
