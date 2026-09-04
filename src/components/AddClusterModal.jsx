import { Alert, App as AntApp, Form, Input, Modal, theme } from "antd";
import { useState } from "react";

import { storeCluster } from "../utils/clusterStorage";
import "../styles/AddClusterModal.css";

function AddClusterModal({ open, onCancel, onCreated }) {
  const [form] = Form.useForm();
  const { message } = AntApp.useApp();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    token: { colorPrimary, colorError },
  } = theme.useToken();

  const handleSubmit = async (values) => {
    setSaving(true);
    setError("");

    try {
      // شبیه‌سازی زمان درخواست POST
      await new Promise((resolve) => {
        setTimeout(resolve, 800);
      });

      const newCluster = {
        id: Date.now(),
        name: values.name,
        address: values.address,
        namespace_count: 0,
        namespaces: [],
      };

      // Token عمداً در localStorage ذخیره نمی‌شود.
      storeCluster(newCluster);

      form.resetFields();
      message.success("Cluster added successfully.");
      onCreated(newCluster);
    } catch (requestError) {
      setError(requestError.message || "Could not add the cluster.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (saving) return;

    setError("");
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      centered
      open={open}
      title="Add New Cluster"
      okText="Add Cluster"
      cancelText="Cancel"
      closable={!saving}
      maskClosable={!saving}
      okButtonProps={{ disabled: saving }}
      cancelButtonProps={{ disabled: saving }}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      modalRender={(modal) => (
        <div
          className={`add-cluster-modal-shell ${
            saving ? "add-cluster-modal-shell--loading" : ""
          }`}
          style={{
            "--modal-beam-primary": colorPrimary,
            "--modal-beam-error": colorError,
          }}
        >
          {modal}
        </div>
      )}
    >
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Cluster Name"
          rules={[
            {
              required: true,
              message: "Enter the cluster name.",
            },
          ]}
        >
          <Input placeholder="production-cluster" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Cluster Address"
          rules={[
            {
              required: true,
              message: "Enter the cluster address.",
            },
          ]}
        >
          <Input placeholder="https://cluster.example.com" />
        </Form.Item>

        <Form.Item
          name="token"
          label="Cluster Token"
          rules={[
            {
              required: true,
              message: "Enter the cluster token.",
            },
          ]}
        >
          <Input.Password placeholder="Cluster token" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddClusterModal;
