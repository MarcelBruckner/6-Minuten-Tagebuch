import { Eintrag, EintragService, OpenAPI } from "../client";
import EintraegeListCard from "../components/EintraegeListCard";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";


export default function Home() {
    const [eintraege, setEintraege] = useState<Array<Eintrag>>([])
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
                const response = await EintragService.eintragGetEintraegeInDateRange({})
                setEintraege(response.sort((a, b) => a.datum.localeCompare(b.datum)).reverse());
            } catch (e) {
                console.log(e);
            }
        }
        getEintraege();
    }, [cookies, navigate])

    return <Box sx={{ mb: 10, mt: 2 }}>
        {
            eintraege.map((eintrag) =>
                <EintraegeListCard eintrag={eintrag} />
            )
        }
    </Box>
}
