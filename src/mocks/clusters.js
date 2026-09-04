export const mockClusters = [
  {
    id: 1,
    name: "test-cluster1",
    address: "https://37.32.25.7:6443",
    namespace_count: 2,

    namespaces: [
      {
        id: 10,
        cluster: 1,
        name: "default",
        status: "ready",

        apps: [
          {
            id: 100,
            name: "django-backend",
            namespace: 10,
            image: "ghcr.io/yasaman/django-backend:latest",
            replicas: 2,
            cpu_request: "100m",
            cpu_limit: "500m",
            memory_request: "128Mi",
            memory_limit: "512Mi",
            created_at: "2026-09-01T10:30:00Z",
            status: "ready",
          },
          {
            id: 101,
            name: "celery-worker",
            namespace: 10,
            image: "ghcr.io/yasaman/django-backend:latest",
            replicas: 1,
            cpu_request: "100m",
            cpu_limit: "300m",
            memory_request: "128Mi",
            memory_limit: "256Mi",
            created_at: "2026-09-01T11:00:00Z",
            status: "failed",
          },
        ],
      },
      {
        id: 11,
        cluster: 1,
        name: "cluster-manager",
        status: "terminating",

        apps: [
          {
            id: 102,
            name: "postgres",
            namespace: 11,
            image: "postgres:16",
            replicas: 1,
            cpu_request: "200m",
            cpu_limit: "500m",
            memory_request: "256Mi",
            memory_limit: "1Gi",
            created_at: "2026-09-02T08:15:00Z",
            status: "terminating",
          },
        ],
      },
    ],
  },

  {
    id: 2,
    name: "test-cluster2",
    address: "https://example.com:6443",
    namespace_count:1,

    namespaces: [
      {
        id: 12,
        cluster: 2,
        name: "production",
        status: "ready",

        apps: [
          {
            id: 103,
            name: "frontend",
            namespace: 12,
            image: "ghcr.io/yasaman/frontend:latest",
            replicas: 3,
            cpu_request: "50m",
            cpu_limit: "200m",
            memory_request: "64Mi",
            memory_limit: "256Mi",
            created_at: "2026-09-02T12:00:00Z",
            status: "not_ready",
          },
          {
            id: 104,
            name: "redis",
            namespace: 12,
            image: "redis:7-alpine",
            replicas: 1,
            cpu_request: "50m",
            cpu_limit: "200m",
            memory_request: "64Mi",
            memory_limit: "256Mi",
            created_at: "2026-09-02T12:20:00Z",
            status: "pending",
          },
        ],
      },
    ],
  },

  {
    id: 3,
    name: "test-cluster1",
    address: "https://37.32.25.7:6443",
    namespace_count: 2,

    namespaces: [
      {
        id: 10,
        cluster: 1,
        name: "default",
        status: "ready",

        apps: [
          {
            id: 100,
            name: "django-backend",
            namespace: 10,
            image: "ghcr.io/yasaman/django-backend:latest",
            replicas: 2,
            cpu_request: "100m",
            cpu_limit: "500m",
            memory_request: "128Mi",
            memory_limit: "512Mi",
            created_at: "2026-09-01T10:30:00Z",
            status: "ready",
          },
          {
            id: 101,
            name: "celery-worker",
            namespace: 10,
            image: "ghcr.io/yasaman/django-backend:latest",
            replicas: 1,
            cpu_request: "100m",
            cpu_limit: "300m",
            memory_request: "128Mi",
            memory_limit: "256Mi",
            created_at: "2026-09-01T11:00:00Z",
            status: "failed",
          },
        ],
      },
      {
        id: 11,
        cluster: 1,
        name: "cluster-manager",
        status: "terminating",

        apps: [
          {
            id: 102,
            name: "postgres",
            namespace: 11,
            image: "postgres:16",
            replicas: 1,
            cpu_request: "200m",
            cpu_limit: "500m",
            memory_request: "256Mi",
            memory_limit: "1Gi",
            created_at: "2026-09-02T08:15:00Z",
            status: "terminating",
          },
        ],
      },
    ],
  },

  {
    id: 4,
    name: "test-cluster1",
    address: "https://37.32.25.7:6443",
    namespace_count: 2,

    namespaces: [
      {
        id: 10,
        cluster: 1,
        name: "default",
        status: "ready",

        apps: [
          {
            id: 100,
            name: "django-backend",
            namespace: 10,
            image: "ghcr.io/yasaman/django-backend:latest",
            replicas: 2,
            cpu_request: "100m",
            cpu_limit: "500m",
            memory_request: "128Mi",
            memory_limit: "512Mi",
            created_at: "2026-09-01T10:30:00Z",
            status: "ready",
          },
          {
            id: 101,
            name: "celery-worker",
            namespace: 10,
            image: "ghcr.io/yasaman/django-backend:latest",
            replicas: 1,
            cpu_request: "100m",
            cpu_limit: "300m",
            memory_request: "128Mi",
            memory_limit: "256Mi",
            created_at: "2026-09-01T11:00:00Z",
            status: "failed",
          },
        ],
      },
      {
        id: 11,
        cluster: 1,
        name: "cluster-manager",
        status: "terminating",

        apps: [
          {
            id: 102,
            name: "postgres",
            namespace: 11,
            image: "postgres:16",
            replicas: 1,
            cpu_request: "200m",
            cpu_limit: "500m",
            memory_request: "256Mi",
            memory_limit: "1Gi",
            created_at: "2026-09-02T08:15:00Z",
            status: "terminating",
          },
        ],
      },
    ],
  },

  {
    id: 4,
    name: "test-cluster1",
    address: "https://37.32.25.7:6443",
    namespace_count: 2,

    namespaces: [
      {
        id: 10,
        cluster: 1,
        name: "default",
        status: "ready",

        apps: [
          {
            id: 100,
            name: "django-backend",
            namespace: 10,
            image: "ghcr.io/yasaman/django-backend:latest",
            replicas: 2,
            cpu_request: "100m",
            cpu_limit: "500m",
            memory_request: "128Mi",
            memory_limit: "512Mi",
            created_at: "2026-09-01T10:30:00Z",
            status: "ready",
          },
          {
            id: 101,
            name: "celery-worker",
            namespace: 10,
            image: "ghcr.io/yasaman/django-backend:latest",
            replicas: 1,
            cpu_request: "100m",
            cpu_limit: "300m",
            memory_request: "128Mi",
            memory_limit: "256Mi",
            created_at: "2026-09-01T11:00:00Z",
            status: "failed",
          },
        ],
      },
      {
        id: 11,
        cluster: 1,
        name: "cluster-manager",
        status: "terminating",

        apps: [
          {
            id: 102,
            name: "postgres",
            namespace: 11,
            image: "postgres:16",
            replicas: 1,
            cpu_request: "200m",
            cpu_limit: "500m",
            memory_request: "256Mi",
            memory_limit: "1Gi",
            created_at: "2026-09-02T08:15:00Z",
            status: "terminating",
          },
        ],
      },
    ],
  },
];