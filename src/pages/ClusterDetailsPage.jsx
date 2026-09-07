import { Alert, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getClusters } from "../api/clusters";
import ClusterCard from "../components/ClusterCard";
import "../styles/ClusterDetailsPage.css";

const { Title, Text } = Typography;

function ClusterDetailsPage() {
  const { clusterId } = useParams();

  const [cluster, setCluster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getClusters()
      .then((data) => {
        if (cancelled) return;

        const clusterList = Array.isArray(data) ? data : (data.results ?? []);

        const foundCluster = clusterList.find(
          (item) => String(item.id) === String(clusterId),
        );

        setCluster(foundCluster ?? null);
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError.message);
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
  }, [clusterId]);

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert type="error" message={error} showIcon />;
  }

  if (!cluster) {
    return <p>Cluster not found.</p>;
  }

  return (
    <main className="cluster-details-page">
      <section className="cluster-details-header">
        <Title level={2} className="cluster-details-title">
          {cluster.name}
        </Title>

        <Text type="secondary" className="cluster-details-address">
          {cluster.address}
        </Text>
      </section>

      <ClusterCard cluster={cluster} />
    </main>
  );
}

export default ClusterDetailsPage;
