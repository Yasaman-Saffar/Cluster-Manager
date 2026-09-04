import {
  Button,
  Descriptions,
  Modal,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";

import "../styles/AppDetailsModal.css";

const { Text, Title } = Typography;

function AppDetailsModal({
  app,
  open,
  statusColor,
  onClose,
  onEdit,
  onDelete,
}) {
  const {
    token: { colorPrimary, colorBorderSecondary, colorFillQuaternary },
  } = theme.useToken();

  if (!app) {
    return null;
  }

  return (
    <Modal
      centered
      width={760}
      open={open}
      className="app-details-modal"
      onCancel={onClose}
      title={
        <Space size={10}>
          <span>{app.name}</span>

          <Tag color={statusColor}>{app.status || "unknown"}</Tag>
        </Space>
      }
      footer={[
        <Button key="edit" type="primary" onClick={onEdit}>
          Edit App
        </Button>,

        <Button key="delete" danger onClick={onDelete}>
          Delete App
        </Button>,
      ]}
    >
      <section
        className="app-image-section"
        style={{
          background: colorFillQuaternary,
          borderColor: colorBorderSecondary,
        }}
      >
        <Text type="secondary">Container Image</Text>

        <Text code copyable>
          {app.image || "—"}
        </Text>
      </section>

      <section className="app-details-section">
        <Title level={5}>General</Title>

        <Descriptions
          bordered
          column={2}
          items={[
            {
              key: "id",
              label: "App ID",
              children: app.id,
            },
            {
              key: "replicas",
              label: "Replicas",
              children: app.replicas ?? "—",
            },
            {
              key: "created",
              label: "Created At",
              children: app.created_at
                ? new Date(app.created_at).toLocaleString()
                : "—",
            },
          ]}
        />
      </section>

      <section className="app-details-section">
        <Title level={5}>Resources</Title>

        <Descriptions
          bordered
          column={2}
          items={[
            {
              key: "cpu-request",
              label: "CPU Request",
              children: app.cpu_request || "—",
            },
            {
              key: "cpu-limit",
              label: "CPU Limit",
              children: app.cpu_limit || "—",
            },
            {
              key: "memory-request",
              label: "Memory Request",
              children: app.memory_request || "—",
            },
            {
              key: "memory-limit",
              label: "Memory Limit",
              children: app.memory_limit || "—",
            },
          ]}
        />
      </section>
    </Modal>
  );
}

export default AppDetailsModal;
