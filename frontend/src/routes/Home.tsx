import { Daily, DailyService, OpenAPI } from "../client";
import EintraegeListCard from "../components/EintraegeListCard";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";


export default function Home() {
    const [eintraege, setEintraege] = useState<Array<Daily>>([])
    const [cookies] = useCookies(['sechs_minuten_tagebuch_token'])
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.sechs_minuten_tagebuch_token) {
            navigate("/signin");
            return;
        }
        OpenAPI.TOKEN = cookies.sechs_minuten_tagebuch_token;

        async function getEintraege() {
            try {
                const response = await DailyService.dailyGetDailiesInDateRange({})
                setEintraege(response.sort((a, b) => a.datum.localeCompare(b.datum)).reverse());
            } catch (e) {
                console.log(e);
            }
        }
        getEintraege();
    }, [cookies, navigate])

    return <>
        {
            eintraege.map((Daily) =>
                <EintraegeListCard Daily={Daily} />
            )
        }
    </>
}
