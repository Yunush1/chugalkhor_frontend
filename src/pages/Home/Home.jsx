import { useState, useEffect, useCallback } from "react";
import { useCreateRoom, useJoinInAndLeaveRooms, useNearbyRooms } from "../../services/queries/roomQueries"
import useIsMobile from "./hooks/useIsMobile";

import SidePanel from "./components/SidePanel";
import ChatPanel from "./components/ChatPanel";
import WelcomeScreen from "./components/WelcomeScreen";
import LocationLoading from "./components/LocationLoading";
import LocationError from "./components/LocationError";

import Globals, { S } from "./style/Globals"; // or move to index.html / global css
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../services/socket/SocketProvider";
import { FloatButton } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateRoomModal from "./components/CreateRoomModal";
import ChugalaKhorModal from "./components/ChugalKhorModal";
import { useNewUserJoined } from "../../services/queries/messageQueries";

export default function Home() {
  const [coords, setCoords] = useState(null);
  const [locMsg, setLocMsg] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const queryClient = useQueryClient()
  const { user } = queryClient.getQueryData(['auth']) || {};
  const [search, setSearch] = useState("");
  const [joined, setJoined] = useState(new Set());
  const isJoined = activeRoom?.members?.includes(user?._id);
  const [showDetail, setShowDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [room, setRoom] = useState()
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const { mutate: createRooms } = useCreateRoom()
  const { mutate: joinRoom, isPending } = useJoinInAndLeaveRooms()
  const { handleRejoinInRoom } = useSocket()
  const isMobile = useIsMobile();
  useNewUserJoined();
  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocMsg("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      p => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
      e => {
        const messages = {
          [e.PERMISSION_DENIED]: "Location access was denied.",
          [e.POSITION_UNAVAILABLE]: "Location information is unavailable.",
          [e.TIMEOUT]: "Location request timed out.",
        };
        setLocMsg(messages[e.code] || "Unknown error.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    setJoined(activeRoom?.members?.filter(user?._id));
  }, []);

  const { data: rooms = [], isLoading, isError, error } = useNearbyRooms(coords);


  const selectRoom = useCallback(
    room => {
      setActiveRoom(room);
      if (isMobile) setShowDetail(true);
    },
    [isMobile]
  );


  const handleJoin = async (room) => {
    if (!room?._id) return;

    try {
      // First try to rejoin via socket (in case of disconnect/reconnect)
      await handleRejoinInRoom({ roomId: room._id });
      // if (!activeRoom) return;
      // Then actually join if not already member
      if (!room.members?.includes(user?._id)) {
        joinRoom(
          { roomId: room._id, type: 'join' },
          {
            onSuccess: () => {
              // Optimistically update local state
              setJoined(prev => {
                const newSet = new Set(prev);
                newSet.add(room._id);
                return newSet;
              });

              // Also update activeRoom if you want
              setActiveRoom(prev =>
                prev?._id === room._id
                  ? { ...prev, members: [...(prev.members || []), user._id] }
                  : prev
              );
            }
          }
        );
      }
    } catch (err) {
      console.error("Failed to join room:", err);
      // show toast / error message
    }
  };

  const handleCreateRoom = async (data) => {
    await createRooms(data)
  }

  const handleLeaveRoom = async (data) => {
    await joinRoom(
      { roomId: data._id, type: 'leave' });
    setActiveRoom(null)
  }
  // Gate screens
  if (!coords && !locMsg) return <LocationLoading />;
  if (locMsg) return <LocationError msg={locMsg} />;

  // Mobile layout
  if (isMobile) {
    return (
      <div style={S.root}>
        <Globals />
        {showDetail && activeRoom ? (
          <ChatPanel
            room={activeRoom}
            isJoined={isJoined}
            onJoin={handleJoin}
            onBack={() => setShowDetail(false)}
            isMobile
            onLeave={handleLeaveRoom}
          />
        ) : (
          <SidePanel
            rooms={rooms}
            activeRoom={activeRoom}
            onSelect={selectRoom}
            search={search}
            onSearch={setSearch}
            joined={joined}
            isLoading={isLoading}
            isError={isError}
            error={error}
            isMobile
          />
        )}
        
        <FloatButton
          shape="square"
          type="primary"
          style={{ insetInlineEnd: 24 }}
          icon={<PlusCircleOutlined />}
          tooltip="Create Room"
          onClick={() => setIsModalOpen(true)}
        />
        <CreateRoomModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateRoom}
        />
      </div>
    );
  }

  // Desktop layout
  return (
    <div style={S.root}>
      <Globals />
      <div style={S.desktopWrap}>
        <SidePanel
          rooms={rooms}
          activeRoom={activeRoom}
          onSelect={(data) => {
            setActiveRoom(data);
            handleJoin(data)
          }}
          search={search}
          onSearch={setSearch}
          joined={isJoined}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
        <div style={S.chatArea}>
          {activeRoom ? (
            <ChatPanel
              room={activeRoom}
              isJoined={isJoined}
              onJoin={handleJoin}
              openUserModal={(data) => {
                setRoom(data)
                setIsOpenUserModal(true)
              }}
              onLeave={handleLeaveRoom}
            />
          ) : (
            <WelcomeScreen />
          )}
        </div>
      </div>
      <FloatButton
        shape="square"
        type="primary"
        style={{ insetInlineEnd: 24 }}
        icon={<PlusCircleOutlined />}
        tooltip="Create Room"
        onClick={() => setIsModalOpen(true)}
      />

      <CreateRoomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateRoom}
      />
      <ChugalaKhorModal roomId={room?._id} onClose={() => setIsOpenUserModal(false)} open={isOpenUserModal} roomName={room?.name} isCreator={room?.createdBy === user?._id} currentUserId={user?._id} />
    </div>
  );
}
