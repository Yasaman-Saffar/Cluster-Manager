import { useEffect, useState } from "react";
import { App as AntApp } from "antd";

import { getApps } from "../api/apps";

const simulateRequest = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

function useClusterWorkspace(cluster) {
  const { message } = AntApp.useApp();

  const [namespaces, setNamespaces] = useState(
    cluster.namespaces ?? []
  );

  const [
    selectedNamespaceId,
    setSelectedNamespaceId,
  ] = useState(
    String(cluster.namespaces?.[0]?.id ?? "")
  );

  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] =
    useState(false);
  const [appsError, setAppsError] = useState("");

  const [operation, setOperation] = useState({
    loading: false,
    label: "",
  });

  const selectedNamespace = namespaces.find(
    (namespace) =>
      String(namespace.id) === selectedNamespaceId
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
    } catch (error) {
      message.error(
        error.message || errorMessage
      );
    } finally {
      setOperation({
        loading: false,
        label: "",
      });
    }
  };

  const createNamespace = async (name) => {
    await runOperation({
      label: "Creating namespace...",
      successMessage:
        `${name} namespace created successfully.`,
      errorMessage: "Could not create namespace.",

      task: async () => {
        await simulateRequest();

        const newNamespace = {
          id: Date.now(),
          name,
          status: "ready",
          apps: [],
        };

        setNamespaces((current) => [
          ...current,
          newNamespace,
        ]);

        setSelectedNamespaceId(
          String(newNamespace.id)
        );
      },
    });
  };

  const deleteNamespace = async (namespace) => {
    if (!namespace) return;

    await runOperation({
      label: "Deleting namespace...",
      successMessage:
        `${namespace.name} namespace deleted.`,
      errorMessage: "Could not delete namespace.",

      task: async () => {
        await simulateRequest();

        const remainingNamespaces =
          namespaces.filter(
            (item) => item.id !== namespace.id
          );

        setNamespaces(remainingNamespaces);

        if (
          String(namespace.id) ===
          selectedNamespaceId
        ) {
          setSelectedNamespaceId(
            String(
              remainingNamespaces[0]?.id ?? ""
            )
          );
        }
      },
    });
  };

  const deleteApp = async (app) => {
    if (!app) return;

    await runOperation({
      label: "Deleting the app...",
      successMessage:
        `${app.name} deleted successfully.`,
      errorMessage:
        "Could not delete app.",

      task: async () => {
        await simulateRequest();

        setApps((currentApps) =>
          currentApps.filter(
            (currentApp) =>
              currentApp.id !== app.id
          )
        );

        setNamespaces((currentNamespaces) =>
          currentNamespaces.map((namespace) => {
            if (
              String(namespace.id) !==
              selectedNamespaceId
            ) {
              return namespace;
            }

            return {
              ...namespace,
              apps: (
                namespace.apps ?? []
              ).filter(
                (currentApp) =>
                  currentApp.id !== app.id
              ),
            };
          })
        );
      },
    });
  };

  useEffect(() => {
    if (!selectedNamespaceId) {
      setApps([]);
      setAppsError("");
      return;
    }

    const currentNamespace = namespaces.find(
      (namespace) =>
        String(namespace.id) ===
        selectedNamespaceId
    );

    if (!currentNamespace) {
      setApps([]);
      setAppsError("");
      return;
    }

    if (Array.isArray(currentNamespace.apps)) {
      setApps(currentNamespace.apps);
      setAppsLoading(false);
      setAppsError("");
      return;
    }

    let cancelled = false;

    setApps([]);
    setAppsLoading(true);
    setAppsError("");

    getApps(selectedNamespaceId)
      .then((data) => {
        if (!cancelled) {
          const appList = Array.isArray(data)
            ? data
            : data.results ?? [];

          setApps(appList);
        }
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
  }, [namespaces, selectedNamespaceId]);

  const isBusy =
    operation.loading || appsLoading;

  const loadingLabel =
    operation.label ||
    (appsLoading
      ? "Loading apps..."
      : "");

  return {
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
  };
}

export default useClusterWorkspace;