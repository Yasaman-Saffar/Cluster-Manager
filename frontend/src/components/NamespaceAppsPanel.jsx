import {
  Alert,
  Button,
  Dropdown,
  Empty,
  List,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { getAppStatusColor } from "../utils/status";

const { Title, Text } = Typography;

function NamespaceAppsPanel({
  clusterId,
  namespace,
  apps,
  error,
  onClearError,
  onSelectApp,
  onDeleteNamespace,
}) {
  const navigate = useNavigate();

  if (!namespace) {
    return (
      <section className="namespace-content">
        <Empty
          className="namespace-empty"
          description="No namespaces"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </section>
    );
  }

  const namespaceMenuItems = [
    {
      key: "delete",
      label: "Delete namespace",
      danger: true,
    },
  ];

  const handleCreateApp = () => {
    navigate(`/clusters/${clusterId}/namespaces/${namespace.id}/apps/new`, {
      state: {
        namespaceName: namespace.name,
      },
    });
  };

  return (
    <section className="namespace-content">
      <div className="namespace-content-header">
        <div>
          <Title level={4}>{namespace.name}</Title>

          <Text type="secondary">Apps in this namespace</Text>
        </div>

        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateApp}
          >
            Create App
          </Button>

          <Dropdown
            trigger={["click"]}
            menu={{
              items: namespaceMenuItems,
              onClick: ({ key }) => {
                if (key === "delete") {
                  onDeleteNamespace(namespace);
                }
              },
            }}
          >
            <Button
              icon={<EllipsisOutlined />}
              aria-label="Namespace actions"
            />
          </Dropdown>
        </Space>
      </div>

      {error && (
        <Alert
          type="error"
          message="Could not load apps"
          description={error}
          showIcon
          closable
          className="apps-error"
          onClose={onClearError}
        />
      )}

      <List
        className="app-list"
        dataSource={apps}
        locale={{
          emptyText: "No apps in this namespace",
        }}
        renderItem={(app) => (
          <List.Item
            extra={
              <Tag color={getAppStatusColor(app.status)}>
                {app.status || "unknown"}
              </Tag>
            }
          >
            <Button type="link" onClick={() => onSelectApp(app)}>
              {app.name}
            </Button>
          </List.Item>
        )}
      />
    </section>
  );
}

export default NamespaceAppsPanel;
