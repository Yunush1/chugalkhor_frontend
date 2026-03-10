import { useState } from "react";
import { C } from "../constants/design";
export default function IconBtn({ children }) {
    const [hover, setHover] = useState(false);
    return (
        <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            style={{
                background: hover ? C.divider : "transparent", border: "none", borderRadius: "50%",
                width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "background .15s", flexShrink: 0
            }}>
            {children}
        </button>
    );
}