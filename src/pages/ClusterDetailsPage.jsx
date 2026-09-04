import { Typography } from "antd";
import { useParams } from "react-router-dom";

import ClusterCard from "../components/ClusterCard";
import { mockClusters } from "../mocks/clusters";
import "../styles/ClusterDetailsPage.css";

const { Title, Text } = Typography;

function ClusterDetailsPage() {
  const { clusterId } = useParams();

  const cluster = mockClusters.find((item) => String(item.id) === clusterId);

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
