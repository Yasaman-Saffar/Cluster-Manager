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
  Spin,
  Typography,
  theme,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApp, updateApp } from "../api/apps";
import "../styles/EditAppPage.css";

const { Title, Text } = Typography;

function EditAppPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const {
    token: {
      colorPrimary,
      colorError,
      colorBgContainer,
      colorBorderSecondary,
      colorFillQuaternary,
    },
  } = theme.useToken();

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setLoadError("");

    getApp(appId)
      .then((data) => {
        if (!cancelled) {
          setApp(data);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setLoadError(requestError.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [appId]);

  if (loading) {
    return <Spin />;
  }

  if (loadError) {
    return (
      <main className="edit-app-page">
        <Alert type="error" message={loadError} showIcon />
      </main>
    );
  }

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
      await updateApp(appId, values);

      message.success("App updated successfully.");

      navigate(-1);
    } catch (requestError) {
      setError(requestError.message || "Could not update the app.");
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

        <Text type="secondary">Update app settings</Text>
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

        <Card className="edit-app-card" title="App Configuration">
          {error && (
            <Alert
              type="error"
              message="Could not update app"
              description={error}
              showIcon
              closable
              className="edit-app-alert"
              onClose={() => setError("")}
            />
          )}

          <Form layout="vertical" initialValues={app} onFinish={handleSubmit}>
            <section className="edit-form-section">
              <Title level={5}>App</Title>

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
              <Button type="primary" htmlType="submit" loading={saving}>
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
