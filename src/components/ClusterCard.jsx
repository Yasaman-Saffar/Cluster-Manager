import { useState } from "react";
import { Card, Typography, theme } from "antd";
import { useNavigate } from "react-router-dom";

import useClusterWorkspace from "../hooks/useClusterWorkspace";
import { getAppStatusColor } from "../utils/status";

import NamespaceSidebar from "./NamespaceSidebar";
import NamespaceAppsPanel from "./NamespaceAppsPanel";
import AppDetailsModal from "./AppDetailsModal";
import CreateNamespaceModal from "./CreateNamespaceModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

import "../styles/ClusterCard.css";

const { Title } = Typography;

function ClusterCard({ cluster }) {
  const navigate = useNavigate();

  const {
    token: {
      colorPrimary,
      colorError,
      colorBgContainer,
      colorBorderSecondary,
      colorFillQuaternary,
      colorTextSecondary,
    },
  } = theme.useToken();

  const {
    namespaces,
    selectedNamespace,
    selectedNamespaceId,
    setSelectedNamespaceId,

    apps,
    appsError,
    setAppsError,

    isBusy,
    loadingLabel,

    createNamespace,
    deleteNamespace,
    deleteApp,
  } = useClusterWorkspace(cluster);

  const [createNamespaceOpen, setCreateNamespaceOpen] = useState(false);

  const [namespaceToDelete, setNamespaceToDelete] = useState(null);

  const [selectedApp, setSelectedApp] = useState(null);

  const [appToDelete, setAppToDelete] = useState(null);

  const handleCreateNamespace = async (name) => {
    setCreateNamespaceOpen(false);
    await createNamespace(name);
  };

  const handleConfirmNamespaceDelete = async () => {
    const namespace = namespaceToDelete;

    setNamespaceToDelete(null);
    await deleteNamespace(namespace);
  };

  const handleConfirmAppDelete = async () => {
    const app = appToDelete;

    setAppToDelete(null);
    await deleteApp(app);
  };

  return (
    <>
      <div
        className={`cluster-card-shell ${
          isBusy ? "cluster-card-shell--loading" : ""
        }`}
        aria-busy={isBusy}
        style={{
          "--beam-primary": colorPrimary,
          "--beam-error": colorError,
          "--beam-surface": colorBgContainer,
          "--workspace-border": colorBorderSecondary,
          "--workspace-soft-bg": colorFillQuaternary,
          "--workspace-muted": colorTextSecondary,
        }}
      >
        {isBusy && (
          <div className="cluster-operation-status">{loadingLabel}</div>
        )}

        <Card
          className="cluster-card"
          title={
            <Title level={4} className="namespace-card-title">
              Namespaces
            </Title>
          }
        >
          <div className="namespace-layout namespace-layout--left">
            <NamespaceSidebar
              namespaces={namespaces}
              selectedNamespaceId={selectedNamespaceId}
              onSelect={setSelectedNamespaceId}
              onCreate={() => setCreateNamespaceOpen(true)}
            />

            <NamespaceAppsPanel
              clusterId={cluster.id}
              namespace={selectedNamespace}
              apps={apps}
              error={appsError}
              onClearError={() => setAppsError("")}
              onSelectApp={setSelectedApp}
              onDeleteNamespace={setNamespaceToDelete}
            />
          </div>
        </Card>
      </div>

      <AppDetailsModal
        app={selectedApp}
        open={selectedApp !== null}
        statusColor={getAppStatusColor(selectedApp?.status)}
        onClose={() => setSelectedApp(null)}
        onEdit={() => {
          const appId = selectedApp.id;

          setSelectedApp(null);
          navigate(`/apps/${appId}/edit`);
        }}
        onDelete={() => {
          setAppToDelete(selectedApp);
          setSelectedApp(null);
        }}
      />

      <CreateNamespaceModal
        open={createNamespaceOpen}
        onCancel={() => setCreateNamespaceOpen(false)}
        onCreate={handleCreateNamespace}
      />

      <ConfirmDeleteModal
        open={appToDelete !== null}
        title={`Delete ${appToDelete?.name ?? ""}?`}
        description={`Are you sure you want to delete ${
          appToDelete?.name ?? ""
        }?`}
        onCancel={() => setAppToDelete(null)}
        onConfirm={handleConfirmAppDelete}
      />

      <ConfirmDeleteModal
        open={namespaceToDelete !== null}
        title={`Delete ${namespaceToDelete?.name ?? ""}?`}
        description={`Are you sure you want to delete ${
          namespaceToDelete?.name ?? ""
        } namespace and all of its apps?`}
        onCancel={() => setNamespaceToDelete(null)}
        onConfirm={handleConfirmNamespaceDelete}
      />
    </>
  );
}

export default ClusterCard;
