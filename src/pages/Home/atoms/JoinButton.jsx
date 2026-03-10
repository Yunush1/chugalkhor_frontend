import { useState } from "react";
import { C } from "../constants/design";
import { S } from "../style/Globals";
import { PlusSVG } from "../icons";
export default function JoinButton({ onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ ...S.joinBtn, backgroundColor: hover ? C.greenDark : C.green }}>
      <PlusSVG />
      Join Room
    </button>
  );
}