import { Form, Input, Modal } from "antd";

function CreateNamespaceModal({
  open,
  onCancel,
  onCreate,
}) {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    await onCreate(values.name);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      centered
      open={open}
      title="Create Namespace"
      okText="Create"
      cancelText="Cancel"
      onOk={() => form.submit()}
      onCancel={handleCancel}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Namespace Name"
          rules={[
            {
              required: true,
              message: "Enter a namespace name.",
            },
            {
              max: 63,
              message:
                "Namespace name cannot exceed 63 characters.",
            },
            {
              pattern:
                /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/,
              message:
                "Use lowercase letters, numbers, and hyphens only.",
            },
          ]}
        >
          <Input placeholder="example-namespace" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateNamespaceModal;