import { C } from "../constants/design";
import Globals from "../style/Globals";
import { S } from "../style/Globals";

export default function LocationError({ msg }) {
  return (
    <div style={S.locScreen}>
      <Globals />
      <div
        style={{
          background: C.white,
          borderRadius: 12,
          padding: 32,
          maxWidth: 380,
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>📍</div>
        <h3
          style={{
            fontSize: 18,
            color: C.textPrimary,
            marginBottom: 8,
          }}
        >
          Location Access Needed
        </h3>
        <p style={{ fontSize: 14, color: C.textSecond, lineHeight: 1.5 }}>
          {msg}
        </p>
      </div>
    </div>
  );
}