import { Alert, Form, Input, Modal } from "antd";
import { useState } from "react";
import { createCluster } from "../api/clusters";

function ConnectClusterModal({
  open,
  onCancel,
  onCreated,
}) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = () => {
    form.resetFields();
    setError("");
    onCancel();
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    setError("");

    try {
      await createCluster(values);
      form.resetFields();
      onCreated();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Connect New Cluster"
      okText="Connect"
      confirmLoading={saving}
      onOk={() => form.submit()}
      onCancel={handleCancel}
    >
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
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
          <Input />
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
          <Input placeholder="https://37.32.25.7:6443" />
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
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ConnectClusterModal;