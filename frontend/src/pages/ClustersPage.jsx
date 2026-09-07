import {
  ApartmentOutlined,
  ArrowRightOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Empty,
  List,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClusters } from "../api/clusters";
import AddClusterModal from "../components/AddClusterModal";
import "../styles/ClustersPage.css";

const { Title, Text } = Typography;

function ClusterPage() {
  const {
    token: {
      colorPrimary,
      colorBorder,
      colorBorderSecondary,
      colorText,
      colorFillSecondary,
      colorTextSecondary,
      colorFillQuaternary,
    },
  } = theme.useToken();

  const [clusters, setClusters] = useState([]);
  const [clustersLoading, setClustersLoading] = useState(true);
  const [clusterError, setClusterError] = useState("");

  const [addClusterOpen, setAddClusterOpen] = useState(false);

  const handleClusterCreated = (newCluster) => {
    setClusters((currentClusters) => [...currentClusters, newCluster]);

    setAddClusterOpen(false);
  };

  useEffect(() => {
    let cancelled = false;

    setClustersLoading(true);
    setClusterError("");

    getClusters()
      .then((data) => {
        if (!cancelled) {
          setClusters(Array.isArray(data) ? data : (data.results ?? []));
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setClusterError(error.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setClustersLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main
      className="clusters-page"
      style={{
        "--cluster-primary": colorPrimary,
        "--cluster-border": colorBorderSecondary,
        "--cluster-muted": colorTextSecondary,
        "--cluster-soft-bg": colorFillQuaternary,
        "--cluster-tag-bg": colorFillSecondary,
        "--cluster-tag-border": colorBorder,
        "--cluster-tag-text": colorText,
      }}
    >
      <section className="clusters-header">
        <div>
          <Title level={2} className="clusters-title">
            Clusters
          </Title>

          <Text type="secondary" className="clusters-description">
            View and manage your Kubernetes clusters
          </Text>
        </div>

        <Space>
          <Tag className="clusters-count">
            {clusters.length} {clusters.length === 1 ? "Cluster" : "Clusters"}
          </Tag>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddClusterOpen(true)}
          >
            Add New Cluster
          </Button>
        </Space>
      </section>

      {clusterError && <Alert type="error" message={clusterError} showIcon />}

      <List
        className="cluster-list"
        loading={clustersLoading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={clusters}
        locale={{
          emptyText: <Empty description="No clusters are connected." />,
        }}
        renderItem={(cluster) => {
          const namespaceCount =
            cluster.namespace_count ?? cluster.namespaces?.length ?? 0;

          return (
            <List.Item>
              <Link
                to={`/clusters/${cluster.id}`}
                className="cluster-card-link"
              >
                <Card hoverable className="cluster-summary-card">
                  <div className="cluster-card-accent" />

                  <div className="cluster-card-heading">
                    <Title level={4} ellipsis className="cluster-name">
                      {cluster.name}
                    </Title>
                  </div>

                  <div className="cluster-namespace-count">
                    <ApartmentOutlined />

                    <span>
                      {namespaceCount === 0 ? (
                        "No Namespaces"
                      ) : (
                        <>
                          <strong>{namespaceCount}</strong>{" "}
                          {namespaceCount === 1 ? "Namespace" : "Namespaces"}
                        </>
                      )}
                    </span>
                  </div>

                  <div className="cluster-address">
                    <Text type="secondary" ellipsis>
                      {cluster.address}
                    </Text>
                  </div>

                  <div className="cluster-card-footer">
                    <span>View cluster</span>
                    <ArrowRightOutlined />
                  </div>
                </Card>
              </Link>
            </List.Item>
          );
        }}
      />

      <AddClusterModal
        open={addClusterOpen}
        onCancel={() => setAddClusterOpen(false)}
        onCreated={handleClusterCreated}
      />
    </main>
  );
}

export default ClusterPage;
