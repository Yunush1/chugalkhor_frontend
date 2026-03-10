import { DotsSVG, PlusSVG, SearchSVG } from "../../icons";
import { S } from "../../style/Globals";
import IconBtn from "../IconBtn";
// import { useCreateRoom } from "../../services/queries/roomQueries";

export default function Header() {

    return (
        <div style={S.sideHeader}>
            <div style={S.sideAvatar}>
                <img src="./logo.png" />
            </div>

            <span style={S.sideTitle}>✌𝓒𝓱𝓾𝓰𝓪𝓵𝓪𝓚𝓱𝓸𝓻✌</span>
        </div>
    );
}