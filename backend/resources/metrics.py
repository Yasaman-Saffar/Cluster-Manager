import time
from functools import wraps

from prometheus_client import Counter, Histogram, Gauge


kubernetes_operations_total = Counter(
    "hamamooz_kubernetes_operations_total",
    "Number of Kubernetes operations by resource, operation, and outcome",
    ["resource", "operation", "outcome"],
)

kubernetes_operations_duration = Histogram(
    "hamamooz_kubernetes_operation_duration_seconds",
    "Duration of Kubernetes operations in seconds",
    ["resource", "operation", "outcome"],
)

backup_jobs_total = Counter(
    "hamamooz_backup_jobs_total",
    "Number of backup jobs by terminal outcome",
    ["outcome"],
)

backup_duration = Histogram(
    "hamamooz_backup_duration_seconds",
    "Backup duration in seconds",
    ["outcome"],
)

backups_in_progress = Gauge(
    "hamamooz_backups_in_progress",
    "Number of backups currently running",
)

def track_kubernetes_operation(resource, operation):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()

            try:
                result = function(*args, **kwargs)

            except Exception:
                outcome = "error"
                raise
            else:
                outcome = "success"
                return result
            finally:
                duration = time.perf_counter() - start

                kubernetes_operations_total.labels(
                    resource=resource,
                    operation=operation,
                    outcome=outcome,
                ).inc()

                kubernetes_operations_duration.labels(
                    resource=resource,
                    operation=operation,
                    outcome=outcome,
                ).observe(duration)

        return wrapper

    return decorator

def track_backup(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        outcome = "faild"
        backups_in_progress.inc()

        try:
            result = function(*args, **kwargs)
        except Exception:
            raise
        else:
            outcome = "completed"
            return result
        finally:
            duration = time.perf_counter() - start

            backup_jobs_total.labels(outcome=outcome).inc()
            backup_duration.labels(outcome=outcome).observe(duration)
            backups_in_progress.dec()

    return wrapper