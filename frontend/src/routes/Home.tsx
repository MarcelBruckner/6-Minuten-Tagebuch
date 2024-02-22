import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eintrag, EintragService, OpenAPI } from "../client";
import { formatDate } from "../common/Helpers";
import EintraegeList from "../components/EintraegeList";

export default function Home() {

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

    return <>
        <EintraegeList></EintraegeList>
    </>
}