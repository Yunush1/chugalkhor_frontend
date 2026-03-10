// src/components/LeavRoom.tsx
import React from 'react';
import { Modal, Button } from 'antd';



const LeavRoom = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Logout',
  message = 'Are you sure you want to logout from the application?',
  okText = 'Logout',
  cancelText = 'Cancel',
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={() => {
        onConfirm();
        onClose();
      }}
      onCancel={onClose}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{
        danger: true,           // makes the button red (destructive action)
      }}
      centered                     // modern centered look
      maskClosable={false}         // prevent close on backdrop click (optional)
      width={420}                  // reasonable width for confirmation
    >
      <p className="text-gray-600 mt-4">{message}</p>
    </Modal>
  );
};

export default LeavRoom;