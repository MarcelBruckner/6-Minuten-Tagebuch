import { Eintrag, EintragService, OpenAPI } from "../client";
import EintraegeListCard from "./EintraegeListCard";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../common/Helpers";
import { Box } from "@mui/material";


export default function EintraegeList() {
    const [eintraege, setEintraege] = useState<Array<Eintrag>>([])
    const [cookies] = useCookies(['token'])
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.token) {
            navigate("/signin");
            return;
        }
        OpenAPI.TOKEN = cookies.token;

        async function getEintraege() {
            try {
                const response = await EintragService.eintragGetLastEintraege({ number: 10, endDate: formatDate() })
                setEintraege(response);
            } catch (e) {
                console.log(e);
            }
        }
        getEintraege();
    }, [cookies])

    return <Box sx={{ mb: 10 }}>
        {
            eintraege.map((eintrag) =>
                <EintraegeListCard eintrag={eintrag} />
            )
        }
    </Box>
}
