import { Modal, List, Avatar, Spin, Tag, Typography, Button, message } from 'antd';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRemoveUserFromRoom, useUsersPerRoom } from "../../../services/queries/roomQueries";

const { Title, Text } = Typography;

export default function ChugalaKhorModal({
    roomId,
    open,
    onClose,
    roomName = "Room Members",
    isCreator = false,           // ← pass true if current user is the creator
    currentUserId,               // ← pass current logged-in user's ID
}) {
    const {
        data,
        isLoading,
        isError,
    } = useUsersPerRoom(roomId);
    const { mutate: removeUserMutation } = useRemoveUserFromRoom()

    const users = data?.users ?? [];
    const memberCount = data?.count ?? 0;

    const handleRemove = (user) => {
        if (!user || !roomId) {
            message.error('User or room is required');
            return;
        }
        // Example structure for real implementation:
        removeUserMutation({ roomId, targetId: user._id });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <Title level={5} className="!m-0">
                        {roomName}
                    </Title>
                    <Tag color="blue" className="m-0">
                        {memberCount} members
                    </Tag>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={480}
            centered
            destroyOnHidden
            className="[&_.ant-modal-body]:p-0"
        >
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Spin size="large" />
                    <Text type="secondary" className="mt-4">
                        Loading members...
                    </Text>
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-20 text-red-600">
                    <Text type="danger">Failed to load room members</Text>
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                    <UserOutlined className="text-6xl" />
                    <Text type="secondary" className="mt-4 text-lg">
                        No members yet
                    </Text>
                </div>
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={users}
                    className="max-h-[60vh] overflow-y-auto"
                    renderItem={(user) => {
                        const isCurrentUser = currentUserId && user._id === currentUserId;
                        const canRemove = isCreator && !isCurrentUser;

                        return (
                            <List.Item
                                className="px-6 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                                actions={
                                    canRemove ? [
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            size="small"
                                            onClick={() => handleRemove(user)}
                                            className="hover:text-red-700"
                                        >
                                            Remove
                                        </Button>
                                    ] : undefined
                                }
                            >
                                <List.Item.Meta
                                    avatar={
                                        user.profilePicture ? (
                                            <Avatar
                                                src={user.profilePicture}
                                                size={48}
                                                className="flex-shrink-0"
                                            />
                                        ) : (
                                            <Avatar
                                                size={48}
                                                icon={<UserOutlined />}
                                                className="bg-green-500 flex-shrink-0"
                                            />
                                        )
                                    }
                                    title={
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-gray-900">
                                                {user.name}
                                            </span>
                                            {isCurrentUser && (
                                                <Tag color="default" className="text-xs">
                                                    You
                                                </Tag>
                                            )}
                                            {user.isOnline && (
                                                <Tag color="success" className="m-0 text-xs px-2 py-0.5">
                                                    Online
                                                </Tag>
                                            )}
                                        </div>
                                    }
                                // description={
                                //   user.username && user.username !== user.name ? (
                                //     <Text type="secondary" className="text-sm">
                                //       @{user.username}
                                //     </Text>
                                //   ) : null
                                // }
                                />
                            </List.Item>
                        );
                    }}
                />
            )}
        </Modal>
    );
}