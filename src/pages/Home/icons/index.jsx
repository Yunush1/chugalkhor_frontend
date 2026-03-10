import { C } from "../constants/design";
const SearchSVG = ({ color = C.icon, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
);
const DotsSVG = ({ color = C.icon, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
);
const BackSVG = ({ color = C.icon, size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
);
const PlusSVG = ({ color = "#fff", size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
);
const CheckSVG = ({ color = C.greenLight, size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
);
const SendSVG = ({ color = C.green, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

export {
    BackSVG,
    PlusSVG,
    CheckSVG,
    SearchSVG,
    DotsSVG,
    SendSVG
}