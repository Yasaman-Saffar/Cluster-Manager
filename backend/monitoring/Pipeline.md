# VictoriaMetrics Pipeline

1. First, I exposed the mentioned metrics on my django app. I installed `prometheus_client` library and set up the settings:
   - `settings.py` : middleware and installed apps
   - `core/urls.py`: exposed `/metrics`
   - `resources/metrics.py`: defined metrics
   - `resources/kuber_service.py`: record operations
2. Then I rebuilt the image(beacause I already have built the non-monitoring version):

```yaml
docker build -t ghcr.io/yasaman-saffar/cluster-manager-backend:monitoring-v2 \.

docker push ghcr.io/yasaman-saffar/cluster-manager-backend:monitoring-v2

kubectl apply -f k8s/backend.yaml
```

3. After that, I added Victoriametrics chart source using this command:

```
helm repo add vm https://victoriametrics.github.io/helm-charts/ helm repo update
```

and then I installed the VM Operator and its CRDs in monitoring-system namespace:

```
helm upgrade --install vm-operator vm/victoria-metrics-operator \ --namespace monitoring-system \ --create-namespace
```

(how did we make the image and what was the difference between the first and second way?)

4. First step that must be done after exposing the metrics is to deploy the VMSingle for storage. What VMSingle does is to store the metrics and let us query in the metrics

5. What I did in this step was deploying VMAgent. It's a component that collects, processes/filters and writes addresses of storages in the remoteWrite spec in VMSingle.
   Questions I ran into in writing the manifest:

```yaml
spec:
	selectAllByDefault: false
	serviceScrapeSelector:
		matchLabels:
			monitoring: cluster-manager

	serviceScrapeNamespaceSelector:
		matchLabels:
			kubernetes.io/metadata.name: cluster-manager
```

In this part we are defining a selector. setting `selectAllByDefault` as `false` means we want to set a custom selector: `VMServiceScrape` s with `monitoring: cluster-manager` lable in `VMServiceScrape` namespace.
[[VictoriaMetrics Components#VMAgent Scraping | More Datails]]

6. Next step is setting up VMServiceScrape. It's a component we define to tell VMAgent which Service to collect from.

   I ran into a bug while I was checking the `/targets` interface. The VMAgent interface showed that the backend target was down. Although the backend pod was running; requests to its `/metrics` endpoint returned HTTP 400.
   I realized that the requests were sent with backend pod's ip in request's header while Django ALLOWED_HOSTS configuration only permitted my own dns.
   So I configured a Host header in the VMSrviceScrape, allowing VMAgent to access the pod while presenting the hostname accepted by Django:

   ```yaml
   vm_scrape_params:
   	headers:
   	- "Host: api.saffar.osdl.ir"
   ```

7. Next step is setting up the Grafana. Like any other apps it needs a PVC, ConfigMap, Deployment and a Service.
   **PVC**
   One question I ran into was this: `Why do we have to write a PVC for grafana while VMSingle does not need it?`
   The answer was because VMSingle is managed by the VictoriaMetrics Operator. The operator automatically creates `persistentvolumeclaim/vmsingle-main`.
   **ConfigMap**
   I configured a datasource in this manifest. A datasource tells Grafana where to het the data it should display. Grafana doesn't store the metrics. It needs to know how to access the metrics and datasource configuration makes it possible for grafana to use its server as data source:

   ```yaml
   datasource.yaml: |
   	apiVersion: 1
   	datasources:
   	- name: VictoriaMetrics
   	  uid: victoriametrics
   	  type: prometheus
   	  access: proxy
   	  url: http://vmsingle-main.monitoring-system.svc:8428
   		isDefault: true
   		editable: false
   ```

   **Deployment**
   I ran into a question while writing this manifest:

   ```yaml
   securityContext:
   	fsGroup: 472
   ```

   Why fsGroup: 472?
   The Grafana container normally runs its process with Grafana's Linux user/group, commonly associated with **UID/GID 472**.
   So we set it to make the mounted volume accessible to group 472.
   Why didn't we use fsGroup for PVCs like db?
   A db like PostgreSQL image usually starts with enough permission to initialize the volume and change its ownership itself.
   But Grafana runs as non-root user/group 472.

# Securing the Pipeline

8. After building the simple pipeline, the next iteration was securing access to VMSingle.

   In the original pipeline, VMAgent and Grafana connected directly to VMSingle.
   In the secured version, I deployed VMAuth between the clients and VMSingle:

```text
    VMAgent → VMAuth → VMSingle
    Grafana → VMAuth → VMSingle
```

[[Observibility/session 2#VMAuth| More Details]]

9. I created two Kubernetes Secrets for two different users:
   - `vm-writer-credentials`: used by VMAgent
   - `vm-reader-credentials`: used by Grafana
   These Secrets have the Kubernetes type `Opaque`, which is the standard type used for storing general sensitive data such as usernames and passwords.
10. Next, I created the `VMAuth` resource.
    `selectAllByDefault: false` means VMAuth does not automatically select every `VMUser`.
    The selectors tell VMAuth to select only the `VMUser` resources that:

- Exist in the `monitoring-system` namespace.
- Have the label `vmauth: main`.
  (Just like ServiceScrape)

11. Then, I created two `VMUser` resources.
    The first user is the VMAgent writer. This user can only access `/api/v1/write`, which VMAgent uses to write collected metrics.
    The second user is the Grafana reader.

This part was new to me:

```yaml
targetRefs:
	- crd:
		kind: VMSingle
		name: main
		namespace: monitoring-system
	paths:
		- "/api/v1/query"
		- "/api/v1/query_range"
		- "/api/v1/series"
		- "/api/v1/labels"
		- "/api/v1/label/.*"
		- "/api/v1/metadata"
		- "/api/v1/status/.*"
```

`targetRefs` has two responsibilities:

- It identifies the destination component, which is `VMSingle/main`.
- It defines the API paths that the user is allowed to access.
