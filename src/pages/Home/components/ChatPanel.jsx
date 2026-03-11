import { useState, useRef, useEffect } from "react";

import Avatar from "../atoms/Avatar";
import Chip from "../atoms/Chip";
import InfoCell from "../atoms/InfoCell";
import JoinButton from "../atoms/JoinButton";
import IconBtn from "../atoms/IconBtn";
import { C } from "../constants/design";
import { S } from "../style/Globals"; // assuming this contains all your styles
import { SearchSVG, DotsSVG, BackSVG, CheckSVG, SendSVG } from "../icons";
import { useSocket } from "../../../services/socket/SocketProvider";
import { useNewMessages, useSendMessage } from "../../../services/queries/messageQueries";
import { useQueryClient } from "@tanstack/react-query";
import { MessageBubble } from "../atoms/MessageBubble";
import { Button } from "antd";
import { LockFilled, LogoutOutlined, QqOutlined } from "@ant-design/icons";
import LeaveRoom from "../atoms/LeaveRoom";



export default function ChatPanel({
    room,
    isJoined,
    onJoin,
    onBack,
    isMobile = false,
    openUserModal,
    onLeave
}) {
    const {
        name = "",
        description = "",
        createdBy = "",
        createdAt,
        members = [],
        maxMembers,
    } = room;

    const pct = Math.round((members.length / maxMembers) * 100);
    const { mutate: handleSendMessage } = useSendMessage()
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData(['auth'])
    const user = data?.user || {};
    const { data: messages = [] } = useNewMessages(room?._id)
    // ── Chat messages state ────────────────────────────────────────────────
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);
    const [visible, setVisible] = useState(false)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim() || !isJoined) return;
        handleSendMessage({ roomId: room?._id, content: inputValue.trim(), timestamp: Date.now(), sender: 'me' })
        setInputValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleLeaveRoom = () => {
        onLeave(room)
    }

    return (
        <div style={S.chatPanel}>
            {/* Header */}
            <div style={S.chatHeader}>
                {isMobile && (
                    <button onClick={onBack} style={S.backBtn}>
                        <BackSVG />
                    </button>
                )}
                <Avatar name={name} size={40} />
                <div style={{ flex: 1, minWidth: 0 }} onClick={() => openUserModal(room)}>
                    <div style={S.chatName}>{name}</div>
                    <div style={S.chatSub}>
                        {members.length} of {maxMembers} members
                    </div>
                </div>
                <IconBtn>
                    <SearchSVG />
                </IconBtn>
                <Button onClick={() => setVisible(true)} className="text-red-500 border-1 border-red-500 hover:text-red-700">
                    <LogoutOutlined />
                    LEAVE
                </Button>
            </div>

            {/* Messages area */}
            <div style={S.messages}>
                <Chip>{fullDate(createdAt)}</Chip>
                <Chip>🔒 Room "{name}" was created</Chip>

                {/* Room info bubble */}
                <div style={{ display: "flex", margin: "8px 0" }}>
                    <div style={S.bubble}>
                        <div style={S.bubbleTail} />
                        <p style={S.bubbleText}>{description}</p>
                        <hr
                            style={{
                                border: "none",
                                borderTop: `1px solid ${C.divider}`,
                                margin: "10px 0",
                            }}
                        />
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 10,
                            }}
                        >
                            <InfoCell label="Created by" val={`User ${createdBy.slice(-6)}`} />
                            <InfoCell
                                label="Members"
                                val={`${members.length} / ${maxMembers}`}
                            />
                        </div>

                        {/* Progress bar */}
                        <div style={{ marginTop: 12 }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 4,
                                }}
                            >
                                <span style={{ fontSize: 12, color: C.textSecond }}>
                                    Capacity
                                </span>
                                <span
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: pct >= 90 ? "#FF6B35" : C.greenLight,
                                    }}
                                >
                                    {pct}%
                                </span>
                            </div>
                            <div
                                style={{
                                    height: 4,
                                    backgroundColor: C.bg,
                                    borderRadius: 2,
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        height: "100%",
                                        borderRadius: 2,
                                        transition: "width .4s ease",
                                        width: `${pct}%`,
                                        backgroundColor: pct >= 90 ? "#FF6B35" : C.greenLight,
                                    }}
                                />
                            </div>
                        </div>

                        <span
                            style={{
                                fontSize: 11,
                                color: C.textSecond,
                                display: "block",
                                textAlign: "right",
                                marginTop: 6,
                            }}
                        >
                            {shortTime(createdAt)}
                        </span>
                    </div>
                </div>

                {isJoined && <Chip>✅ You joined "{name}"</Chip>}

                {/* Actual chat messages */}
                {/* <div className="flex flex-col px-2 py-3 overflow-y-auto h-full"> */}
                {messages.map((msg) => {
                    const isOwn =
                        (typeof msg.sender === 'string' && msg.sender === 'me') ||
                        (msg.sender && typeof msg.sender !== 'string' && msg.sender._id === user?._id);

                    return (
                        <MessageBubble
                            key={msg._id || msg.id || Math.random().toString(36).slice(2)}
                            message={msg}
                            isOwnMessage={isOwn}
                        />
                    );
                })}
                {/* </div> */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div style={S.inputContainer}>
                {isJoined ? (
                    <div style={S.inputWrapper}>
                        <input
                            style={S.messageInput}
                            placeholder="Type a message"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                        <IconBtn onClick={handleSend} disabled={!inputValue.trim()}>
                            <SendSVG />
                        </IconBtn>
                    </div>
                ) : (
                    <div style={S.joinedRow}>
                        <CheckSVG />
                        <span style={{ fontSize: 15, color: C.textSecond }}>
                            You've joined this room
                        </span>
                    </div>
                )}
            </div>
            <LeaveRoom open={visible} onClose={() => setVisible(false)} onConfirm={handleLeaveRoom} okText="Leave Room" cancelText="Cancel" message="Do you want to leaev room" title="Leave Room" />
        </div>
    );
}

// ─── Date Helpers ────────────────────────────────────────────────────────────
const fullDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

const shortTime = (d) =>
    new Date(d).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });