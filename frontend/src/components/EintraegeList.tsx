import { Eintrag, EintragService, OpenAPI } from "../client";
import EintraegeListCard from "./EintraegeListCard";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { formatDate, parseDate } from "../common/Helpers";
import { Box } from "@mui/material";
import { reverse } from "dns";


export default function EintraegeList() {
    const [eintraege, setEintraege] = useState<Array<Eintrag>>([])
    const [cookies] = useCookies(['fuenf_minuten_tagebuch_token'])
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.fuenf_minuten_tagebuch_token) {
            navigate("/signin");
            return;
        }
        OpenAPI.TOKEN = cookies.fuenf_minuten_tagebuch_token;

        async function getEintraege() {
            try {
                const response = await EintragService.eintragGetEintraegeInDateRange({})
                setEintraege(response.sort((a, b) => a.datum.localeCompare(b.datum)).reverse());
            } catch (e) {
                console.log(e);
            }
        }
        getEintraege();
    }, [])

    return <Box sx={{ mb: 10, mt: 2 }}>
        {
            eintraege.map((eintrag) =>
                <EintraegeListCard eintrag={eintrag} />
            )
        }
    </Box>
}
