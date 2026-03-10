import { C, AVATAR_PALETTE } from "../constants/design";

const getColor    = (s = "") => AVATAR_PALETTE[s.charCodeAt(0) % AVATAR_PALETTE.length];
const getInitials = (s = "") => s.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

export default function Avatar({ name = "", size = 49 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: getColor(name),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.37,
        fontWeight: 600,
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {getInitials(name)}
    </div>
  );
}