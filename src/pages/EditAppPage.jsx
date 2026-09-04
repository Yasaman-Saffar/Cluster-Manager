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
import { useNavigate, useParams } from "react-router-dom";

import { mockClusters } from "../mocks/clusters";
import "../styles/EditAppPage.css";

const { Title, Text } = Typography;

const USE_MOCK_API = true;

const simulateRequest = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });

function EditAppPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    token: {
      colorPrimary,
      colorError,
      colorBgContainer,
      colorBorderSecondary,
      colorFillQuaternary,
    },
  } = theme.useToken();

  const cluster = mockClusters.find((item) =>
    item.namespaces?.some((namespace) =>
      namespace.apps?.some((app) => String(app.id) === appId),
    ),
  );

  const namespace = cluster?.namespaces?.find((item) =>
    item.apps?.some((app) => String(app.id) === appId),
  );

  const app = namespace?.apps?.find((item) => String(item.id) === appId);

  if (!app) {
    return (
      <main className="edit-app-page">
        <Alert type="error" message="App not found." showIcon />
      </main>
    );
  }

  const handleSubmit = async (values) => {
    setSaving(true);
    setError("");

    try {
      if (USE_MOCK_API) {
        await simulateRequest();

        console.log("Updated App:", {
          id: app.id,
          ...values,
        });
      } else {
        /*
         * بعد از اتصال backend:
         *
         * await updateApp(app.id, values);
         */
      }

      message.success("Application updated successfully.");

      navigate(-1);
    } catch (requestError) {
      setError(requestError.message || "Could not update the application.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="edit-app-page">
      <header className="edit-app-page-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
        >
          Back to Cluster
        </Button>

        <Title level={2}>Edit {app.name}</Title>

        <Text type="secondary">
          Update app settings
          {namespace?.name && (
            <>
              {" "}
              in namespace <strong>{namespace.name}</strong>
            </>
          )}
        </Text>
      </header>

      <div
        className={`edit-app-card-shell ${
          saving ? "edit-app-card-shell--loading" : ""
        }`}
        aria-busy={saving}
        style={{
          "--edit-primary": colorPrimary,
          "--edit-error": colorError,
          "--edit-surface": colorBgContainer,
          "--edit-border": colorBorderSecondary,
          "--edit-soft-bg": colorFillQuaternary,
        }}
      >
        {saving && <div className="edit-app-status">Saving changes...</div>}

        <Card className="edit-app-card" title="Application Configuration">
          {error && (
            <Alert
              type="error"
              message="Could not update application"
              description={error}
              showIcon
              closable
              className="edit-app-alert"
              onClose={() => setError("")}
            />
          )}

          <Form layout="vertical" initialValues={app} onFinish={handleSubmit}>
            <section className="edit-form-section">
              <Title level={5}>Application</Title>

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
            </section>

            <section className="edit-form-section">
              <Title level={5}>Scaling</Title>

              <Form.Item
                name="replicas"
                label="Replicas"
                rules={[
                  {
                    required: true,
                    message: "Enter the number of replicas.",
                  },
                ]}
                style={{ maxWidth: 240 }}
              >
                <InputNumber min={1} precision={0} style={{ width: "100%" }} />
              </Form.Item>
            </section>

            <section className="edit-form-section">
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

            <Space className="edit-app-actions">
              <Button type="primary" htmlType="submit" disabled={saving}>
                Save Changes
              </Button>

              <Button disabled={saving} onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </Space>
          </Form>
        </Card>
      </div>
    </main>
  );
}

export default EditAppPage;
