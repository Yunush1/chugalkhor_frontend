import Avatar from "../atoms/Avatar";

const RoomCard = ({ data, isActive, onClick }) => {
  const {
    name,
    description,
    createdBy,
    createdAt,
    maxMembers,
    members = [],
  } = data;

  const joinedCount = members.length;
  const fillPercent = Math.round((joinedCount / maxMembers) * 100);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Generate a consistent avatar color from name
  const avatarColors = [
    "#06CF9C", "#25D366", "#00A884", "#34B7F1",
    "#FFB900", "#FF6B35", "#E91E8C", "#9C27B0",
  ];
  const colorIndex = name.charCodeAt(0) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "13px 16px",
        cursor: "pointer",
        backgroundColor: isActive ? "#F0F2F5" : "transparent",
        borderBottom: "1px solid #F0F2F5",
        transition: "background-color 0.1s ease",
        gap: "12px",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = "#F5F6F6";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {/* Avatar */}
      <Avatar name={name} size={40}/>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
          <span
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: "17px",
              fontWeight: "400",
              color: "#111B21",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "200px",
            }}
          >
            {name}
          </span>
          <span
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: "12px",
              color: "#667781",
              flexShrink: 0,
              marginLeft: "6px",
            }}
          >
            {timeAgo(createdAt)}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: "14px",
              color: "#667781",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              marginRight: "8px",
            }}
          >
            {description}
          </span>
          {/* Member count badge */}
          <span
            style={{
              backgroundColor: "#25D366",
              color: "#fff",
              borderRadius: "10px",
              padding: "1px 6px",
              fontSize: "12px",
              fontWeight: "600",
              fontFamily: "'Segoe UI', sans-serif",
              flexShrink: 0,
              minWidth: "20px",
              textAlign: "center",
            }}
          >
            {joinedCount}/{maxMembers}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;