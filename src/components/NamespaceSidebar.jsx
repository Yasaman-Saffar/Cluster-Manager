import { Badge, Button, Popover, Tabs, theme } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { normalizeStatus } from "../utils/status";

function NamespaceSidebar({
  namespaces,
  selectedNamespaceId,
  onSelect,
  onCreate,
}) {
  const {
    token: { colorSuccess, colorWarning, colorError, colorTextSecondary },
  } = theme.useToken();

  const getStatusInfo = (status) => {
    const normalizedStatus = normalizeStatus(status);

    const statuses = {
      ready: {
        label: "Ready",
        color: colorSuccess,
        description: "This namespace is ready for operations.",
      },

      terminating: {
        label: "Terminating",
        color: colorWarning,
        description: "This namespace is being deleted.",
      },

      failed: {
        label: "Failed",
        color: colorError,
        description: "An error occurred in this namespace.",
      },
    };

    return (
      statuses[normalizedStatus] ?? {
        label: status || "Unknown",
        color: colorTextSecondary,
        description: "The namespace status is unknown.",
      }
    );
  };

  const tabItems = namespaces.map((namespace) => {
    const statusInfo = getStatusInfo(namespace.status);

    return {
      key: String(namespace.id),

      label: (
        <Popover
          title={
            <span
              style={{
                color: statusInfo.color,
              }}
            >
              {statusInfo.label}
            </span>
          }
          content={statusInfo.description}
          placement="left"
          trigger="hover"
        >
          <div className="namespace-tab-label">
            <div className="namespace-tab-name">
              <Badge color={statusInfo.color} />

              <span>{namespace.name}</span>
            </div>
          </div>
        </Popover>
      ),
    };
  });

  return (
    <aside className="namespace-tabs-sidebar">
      <Popover content="Create New Namespace" trigger="hover" placement="left">
        <Button
          type="primary"
          className="namespace-add-button"
          icon={<PlusOutlined />}
          aria-label="Create New Namespace"
          onClick={onCreate}
        />
      </Popover>

      <Tabs
        className="namespace-tabs"
        type="card"
        tabPosition="left"
        activeKey={selectedNamespaceId}
        items={tabItems}
        onChange={onSelect}
      />
    </aside>
  );
}

export default NamespaceSidebar;
