// CreateRoomModal.tsx
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, InputNumber, DatePicker, message, Typography, Row, Col } from 'antd';


const CreateRoomModal = ({
  open,
  onClose,
  onCreate,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [coords, setCoords] = useState({})

  // Attempt to auto-fill current location when modal opens
  useEffect(() => {
    if (!open) return;

    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setFieldsValue({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        });
        setCoords(pos.coords)
        setGeoError(null);
        setLoading(false);
      },
      (err) => {
        setGeoError("Couldn't get your location. Please enter coordinates manually.");
        console.warn('Geolocation error:', err);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  }, [open, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        radius: Number(values.radius),
        maxMembers: values.maxMembers ? Number(values.maxMembers) : 100,
        latitude: Number(coords.latitude).toFixed(6),
        longitude: Number(coords.longitude).toFixed(6),
      };

      await onCreate(payload);
      message.success('Room created successfully!');
      form.resetFields();
      onClose();
    } catch (err) {
      message.error(err.message || 'Failed to create room');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold">Create Nearby Room</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      mask={{ closable: !loading }}
      closable={!loading}
      classNames={{
        content: "rounded-xl overflow-hidden border border-gray-200",
        header: "px-6 pt-5 pb-3 border-b border-gray-200",
        body: "px-6 py-5",
        footer: "px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          maxMembers: 100,
          radius: 5, // default 5 km – adjust as needed
        }}
        preserve={false}
      >
        {/* Room Name */}
        <Form.Item
          name="name"
          label={<span className="font-medium">Room Name</span>}
          rules={[{ required: true, message: 'Room name is required' }]}
        >
          <Input
            placeholder="e.g. Connaught Place Evening Hangout"
            size="large"
            maxLength={60}
          />
        </Form.Item>

        {/* Description */}
        <Form.Item name="description" label={<span className="font-medium">Description (optional)</span>}>
          <Input.TextArea
            rows={3}
            placeholder="What's this room for? Who should join?"
            maxLength={300}
            showCount
          />
        </Form.Item>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="radius"
              label={
                <span className="font-medium">
                  Discovery Radius
                  <Typography.Text type="secondary" className="ml-2 text-xs">
                    (km)
                  </Typography.Text>
                </span>
              }
              rules={[{ required: true, message: 'Radius is required' }]}
            >
              <InputNumber
                min={0.5}
                max={50}
                step={0.5}
                style={{ width: '100%' }}
                size="large"
                addonAfter="km"
                placeholder="5"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="maxMembers"
              label={<span className="font-medium">Max Members</span>}
            >
              <InputNumber
                min={2}
                max={500}
                style={{ width: '100%' }}
                size="large"
                placeholder="100 (default)"
              />
            </Form.Item>
          </Col>
        </Row>


        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <Button
            size="large"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
          >
            Create Room
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;