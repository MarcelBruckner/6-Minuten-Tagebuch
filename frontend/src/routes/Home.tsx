import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import EintraegeList from "../components/EintraegeList";

export default function Home() {
    const [cookies] = useCookies(['sechs_minute_tagebuch_token'])
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.sechs_minute_tagebuch_token) {
            navigate("/signin");
            return;
        }
    }, [cookies, navigate])

    return <>
        <EintraegeList ></EintraegeList>
    </>
}