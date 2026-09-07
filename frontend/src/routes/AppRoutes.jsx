import { Navigate, Route, Routes } from "react-router-dom";
import { Result } from "antd";

import ClusterPage from "../pages/ClustersPage";
import ClusterDetailsPage from "../pages/ClusterDetailsPage";
import CreateAppPage from "../pages/CreateAppPage";
import EditAppPage from "../pages/EditAppPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/clusters" replace />} />

      <Route path="/clusters" element={<ClusterPage />} />

      <Route path="/clusters/:clusterId" element={<ClusterDetailsPage />} />

      <Route
        path="/clusters/:clusterId/namespaces/:namespaceId/apps/new"
        element={<CreateAppPage />}
      />

      <Route path="/apps/:appId/edit" element={<EditAppPage />} />

      <Route
        path="*"
        element={
          <Result
            status="404"
            title="404"
            subTitle="The page you requested does not exist."
          />
        }
      />
    </Routes>
  );
}

export default AppRoutes;
