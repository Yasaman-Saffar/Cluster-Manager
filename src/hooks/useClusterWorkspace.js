import { useEffect, useState } from "react";
import { App as AntApp } from "antd";

import {
  getNamespaces,
  createNamespace as createNamespaceRequest,
  deleteNamespace as deleteNamespaceRequest,
} from "../api/namespaces";

import { getApps, deleteApp as deleteAppRequest } from "../api/apps";

function useClusterWorkspace(cluster) {
  const { message } = AntApp.useApp();

  const [namespaces, setNamespaces] = useState([]);
  const [selectedNamespaceId, setSelectedNamespaceId] = useState("");

  const [namespacesLoading, setNamespacesLoading] = useState(false);
  const [namespacesError, setNamespacesError] = useState("");

  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState("");

  const [operation, setOperation] = useState({
    loading: false,
    label: "",
  });

  const selectedNamespace = namespaces.find(
    (namespace) => String(namespace.id) === selectedNamespaceId,
  );

  const runOperation = async ({
    label,
    successMessage,
    errorMessage,
    task,
  }) => {
    setOperation({
      loading: true,
      label,
    });

    try {
      await task();
      message.success(successMessage);
      return true;
    } catch (error) {
      message.error(error.message || errorMessage);
      return false;
    } finally {
      setOperation({
        loading: false,
        label: "",
      });
    }
  };

  // Getting cluster's namespaces
  useEffect(() => {
    let cancelled = false;

    setNamespacesLoading(true);
    setNamespacesError("");

    getNamespaces(cluster.id)
      .then((data) => {
        if (cancelled) return;

        const namespaceList = Array.isArray(data) ? data : (data.results ?? []);

        setNamespaces(namespaceList);

        setSelectedNamespaceId(String(namespaceList[0]?.id ?? ""));
      })
      .catch((error) => {
        if (!cancelled) {
          setNamespaces([]);
          setNamespacesError(error.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setNamespacesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cluster.id]);

  // Get selected namespace's apps
  useEffect(() => {
    if (!selectedNamespaceId) {
      setApps([]);
      setAppsError("");
      return;
    }

    let cancelled = false;

    setAppsLoading(true);
    setAppsError("");

    getApps(selectedNamespaceId)
      .then((data) => {
        if (cancelled) return;

        const appList = Array.isArray(data) ? data : (data.results ?? []);

        setApps(appList);
      })
      .catch((error) => {
        if (!cancelled) {
          setApps([]);
          setAppsError(error.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setAppsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedNamespaceId]);

  const createNamespace = async (name) => {
    return runOperation({
      label: "Creating namespace...",
      successMessage: `${name} namespace created successfully.`,
      errorMessage: "Could not create namespace.",

      task: async () => {
        const newNamespace = await createNamespaceRequest({
          cluster: cluster.id,
          name: name,
        });

        setNamespaces((current) => [...current, newNamespace]);

        setSelectedNamespaceId(String(newNamespace.id));
      },
    });
  };

  const deleteNamespace = async (namespace) => {
    if (!namespace) return false;

    return runOperation({
      label: "Deleting namespace...",
      successMessage: `${namespace.name} namespace deleted.`,
      errorMessage: "Could not delete namespace.",

      task: async () => {
        await deleteNamespaceRequest(namespace.id);

        const remainingNamespaces = namespaces.filter(
          (item) => item.id !== namespace.id,
        );

        setNamespaces(remainingNamespaces);

        if (String(namespace.id) === selectedNamespaceId) {
          setSelectedNamespaceId(String(remainingNamespaces[0]?.id ?? ""));
        }
      },
    });
  };

  const deleteApp = async (app) => {
    if (!app) return false;

    return runOperation({
      label: "Deleting the app...",
      successMessage: `${app.name} deleted successfully.`,
      errorMessage: "Could not delete app.",

      task: async () => {
        await deleteAppRequest(app.id);

        setApps((currentApps) =>
          currentApps.filter((currentApp) => currentApp.id !== app.id),
        );
      },
    });
  };

  const isBusy = namespacesLoading || appsLoading || operation.loading;

  const loadingLabel =
    operation.label ||
    (namespacesLoading
      ? "Loading namespaces..."
      : appsLoading
        ? "Loading apps..."
        : "");

  return {
    namespaces,
    namespacesError,

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
  };
}

export default useClusterWorkspace;
