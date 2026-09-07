import { Modal } from "antd";

function ConfirmDeleteModal({ open, title, description, onCancel, onConfirm }) {
  return (
    <Modal
      centered
      open={open}
      title={title}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <p>{description}</p>
    </Modal>
  );
}

export default ConfirmDeleteModal;
