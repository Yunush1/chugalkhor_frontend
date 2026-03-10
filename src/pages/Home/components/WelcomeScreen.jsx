import { C } from "../constants/design";
import { S } from "../style/Globals";

export default function WelcomeScreen() {
  return (
    <div style={S.welcome}>
      <div style={S.welcomeCircle}>
        <img src="./logo.png" alt="ChugalaKhor"/>
      </div>
      <h2
        style={{
          fontSize: 32,
          fontWeight: 300,
          color: "#41525D",
          margin: 0,
        }}
      >
        Nearby Rooms
      </h2>
      <p
        style={{
          fontSize: 14,
          color: C.textSecond,
          maxWidth: 340,
          textAlign: "center",
          lineHeight: 1.65,
        }}
      >
        Select a room from the list to view details and join the conversation in
        your area.
      </p>
      <div
        style={{
          padding: "8px 16px",
          backgroundColor: "rgba(255,255,255,0.5)",
          borderRadius: 6,
          fontSize: 13,
          color: C.textSecond,
        }}
      >
        🔒 Location-based rooms
      </div>
    </div>
  );
}