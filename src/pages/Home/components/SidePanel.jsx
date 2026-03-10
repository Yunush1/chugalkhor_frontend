import Avatar from "../atoms/Avatar";
import RoomRow from "./RoomRow";
import { C } from "../constants/design";
import { S } from "../style/Globals";
import { SearchSVG, DotsSVG } from "../icons";
import SkeletonRow from "../components/SkeletonRow";
import EmptyState from "../atoms/EmptyState";
import IconBtn from "../atoms/IconBtn";
import Header from "../atoms/header/header";

const searchBoxStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: C.searchBg,
  borderRadius: 8,
  padding: "7px 12px",
  gap: 10,
};

export default function SidePanel({
  rooms,
  activeRoom,
  onSelect,
  search,
  onSearch,
  joined,
  isLoading,
  isError,
  error,
  isMobile = false,
}) {
  return (
    <div style={{ ...S.side, ...(isMobile ? S.sideMobile : {}), background: C.primary }}>
      {/* Header */}
      <Header />

      {/* Search */}
      <div style={{ padding: "8px 12px", backgroundColor: C.white, flexShrink: 0 }}>
        <div style={searchBoxStyle}>
          <SearchSVG color={C.textSecond} size={16} />
          <input
            style={S.searchInput}
            placeholder="Search rooms"
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => onSearch("")} style={S.clearBtn}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div style={S.roomList}>
        {isLoading ? (
          [...Array(7)].map((_, i) => <SkeletonRow key={i} />)
        ) : isError ? (
          <EmptyState
            icon="⚠️"
            title="Error"
            sub={error?.message || "Failed to load rooms"}
          />
        ) : rooms.length === 0 ? (
          <EmptyState
            icon="🏠"
            title="No rooms nearby"
            sub="There are no active rooms in your area right now."
          />
        ) : (
          rooms.map(room => (
            <RoomRow
              key={room._id}
              data={room}
              isActive={activeRoom?._id === room._id}
              isJoined={joined}
              onClick={() => onSelect(room)}
            />
          ))
        )}
      </div>
    </div>
  );
}