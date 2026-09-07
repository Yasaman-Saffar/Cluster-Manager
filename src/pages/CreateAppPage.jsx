import {
  Alert,
  App as AntApp,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Typography,
  theme,
} from "antd";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { createApp } from "../api/apps";
import "../styles/CreateAppPage.css";

const { Title, Text } = Typography;

function CreateAppPage() {
  const { clusterId, namespaceId } = useParams();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  const namespaceName = location.state?.namespaceName || `#${namespaceId}`;

  const {
    token: {
      colorPrimary,
      colorError,
      colorBgContainer,
      colorBorderSecondary,
      colorFillQuaternary,
    },
  } = theme.useToken();

  const returnToCluster = () => {
    navigate(`/clusters/${clusterId}`);
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    setError("");

    try {
      await createApp({
        ...values,
        namespace: Number(namespaceId),
      });

      message.success("App created successfully.");

      returnToCluster();
    } catch (requestError) {
      setError(requestError.message || "Could not create the app.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="create-app-page">
      <header className="create-app-page-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={returnToCluster}
        >
          Back to Cluster
        </Button>

        <Title level={2}>Create New App</Title>

        <Text type="secondary">
          Configure an app for namespace <strong>{namespaceName}</strong>
        </Text>
      </header>

      <div
        className={`create-app-card-shell ${
          saving ? "create-app-card-shell--loading" : ""
        }`}
        aria-busy={saving}
        style={{
          "--create-primary": colorPrimary,
          "--create-error": colorError,
          "--create-surface": colorBgContainer,
          "--create-border": colorBorderSecondary,
          "--create-soft-bg": colorFillQuaternary,
        }}
      >
        {saving && <div className="create-app-status">Creating the app...</div>}

        <Card className="create-app-card" title="App Configuration">
          {error && (
            <Alert
              type="error"
              message="Could not create the app"
              description={error}
              showIcon
              closable
              className="create-app-alert"
              onClose={() => setError("")}
            />
          )}

          <Form
            layout="vertical"
            initialValues={{ replicas: 1 }}
            onFinish={handleSubmit}
          >
            <section className="app-form-section">
              <Title level={5}>App</Title>

              <Row gutter={16}>
                <Col span={10}>
                  <Form.Item
                    name="name"
                    label="App Name"
                    rules={[
                      {
                        required: true,
                        message: "Enter the app name.",
                      },
                    ]}
                  >
                    <Input placeholder="my-app" />
                  </Form.Item>
                </Col>

                <Col span={14}>
                  <Form.Item
                    name="image"
                    label="Container Image"
                    rules={[
                      {
                        required: true,
                        message: "Enter the container image.",
                      },
                    ]}
                  >
                    <Input placeholder="nginx:latest" />
                  </Form.Item>
                </Col>
              </Row>
            </section>

            <section className="app-form-section">
              <Title level={5}>Deployment</Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="replicas"
                    label="Replicas"
                    rules={[
                      {
                        required: true,
                        message: "Enter the number of replicas.",
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      precision={0}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}></Col>
              </Row>
            </section>

            <section className="app-form-section">
              <Title level={5}>Resources</Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="cpu_request" label="CPU Request">
                    <Input placeholder="100m" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="cpu_limit" label="CPU Limit">
                    <Input placeholder="500m" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="memory_request" label="Memory Request">
                    <Input placeholder="128Mi" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="memory_limit" label="Memory Limit">
                    <Input placeholder="512Mi" />
                  </Form.Item>
                </Col>
              </Row>
            </section>

            <Space className="create-app-actions">
              <Button type="primary" htmlType="submit" loading={saving}>
                Create App
              </Button>

              <Button disabled={saving} onClick={returnToCluster}>
                Cancel
              </Button>
            </Space>
          </Form>
        </Card>
      </div>
    </main>
  );
}

export default CreateAppPage;
