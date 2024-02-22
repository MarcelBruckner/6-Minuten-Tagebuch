import { useEffect, useState } from "react";
import { Eintrag, EintragService, OpenAPI } from "../client";
import moment from "moment";
import MyTextField from "../components/MyTextField";
import MyMultipleLinesTextField from "../components/MyMultipleLinesTextField";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../common/Helpers";
import { DAS_NEHME_ICH_MIR_HEUTE_VOR, DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG, DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN, EINE_POSITIVE_AFFIRMATION, HEUTE_WIRD_GUT_WEIL, MORGEN_FREUE_ICH_MICH_AUF } from "../strings/Eintrag";
import { Container } from "@mui/material";


export default function EintragDetail(props: { date: Date }) {
    const [cookies] = useCookies(['token'])
    const navigate = useNavigate();

    const [eintrag, setEintrag] = useState<Eintrag>({
        datum: formatDate(), dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin: ["", "", ""], dasNehmeIchMirHeuteVor: "", heuteWirdGutWeil: "", einePositiveAffirmation: "", spruch: "", dieSchoenstenMomenteAmHeutigenTag: ["", "", ""], morgenFreueIchMichAuf: ""
    });

    useEffect(() => {
        if (!cookies.token) {
            navigate("/signin");
            return;
        }
        OpenAPI.TOKEN = cookies.token;

        async function getEintrag() {
            let formattedDate = (moment(props.date)).format('YYYY-MM-DD')
            try {
                const eintrag = await EintragService.eintragGetEintrag({ datum: formattedDate });
                setEintrag(eintrag);
            } catch (e) {
                console.log(e);
            }
        };
        getEintrag();
    }, [cookies, navigate, props]);

    async function onMyMultipleLinesTextFieldUpdated(title: string, row: number, value: string) {
        if (title === DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN) {
            if (!eintrag.dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin) {
                eintrag.dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin = new Array(row)
            }
            eintrag.dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin[row] = value;
        } else if (title === DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG) {
            if (!eintrag.dieSchoenstenMomenteAmHeutigenTag) {
                eintrag.dieSchoenstenMomenteAmHeutigenTag = new Array(row)
            }
            eintrag.dieSchoenstenMomenteAmHeutigenTag[row] = value;
        } else {
            throw new Error("Unknown MyTextField updated: " + title)
        }

        setEintrag(eintrag);
        await EintragService.eintragPutEintrag({ requestBody: eintrag });
    }

    async function onMyTextFieldUpdated(title: string, value: string) {
        if (title === DAS_NEHME_ICH_MIR_HEUTE_VOR) {
            eintrag.dasNehmeIchMirHeuteVor = value;
        } else if (title === HEUTE_WIRD_GUT_WEIL) {
            eintrag.heuteWirdGutWeil = value;
        } else if (title === EINE_POSITIVE_AFFIRMATION) {
            eintrag.einePositiveAffirmation = value;
        } else if (title === MORGEN_FREUE_ICH_MICH_AUF) {
            eintrag.morgenFreueIchMichAuf = value;
        } else {
            throw new Error("Unknown MyTextField updated: " + title)
        }

        setEintrag(eintrag);
        await EintragService.eintragPutEintrag({ requestBody: eintrag });
    }


    return <>
        <MyMultipleLinesTextField values={eintrag.dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin} onUpdated={onMyMultipleLinesTextFieldUpdated} title={DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN} helperText={DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN} />
        <MyTextField value={eintrag.dasNehmeIchMirHeuteVor} onUpdated={onMyTextFieldUpdated} title={DAS_NEHME_ICH_MIR_HEUTE_VOR} helperText={DAS_NEHME_ICH_MIR_HEUTE_VOR} />
        <MyTextField value={eintrag.heuteWirdGutWeil} onUpdated={onMyTextFieldUpdated} title={HEUTE_WIRD_GUT_WEIL} helperText={HEUTE_WIRD_GUT_WEIL} />

        <Container className="spruch" maxWidth="sm">
            <h1><i>{eintrag.spruch}</i></h1>
        </Container>

        <MyTextField value={eintrag.einePositiveAffirmation} onUpdated={onMyTextFieldUpdated} title={EINE_POSITIVE_AFFIRMATION} helperText={EINE_POSITIVE_AFFIRMATION} />
        <MyMultipleLinesTextField values={eintrag.dieSchoenstenMomenteAmHeutigenTag} onUpdated={onMyMultipleLinesTextFieldUpdated} title={DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG} helperText={DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG} />
        <MyTextField value={eintrag.morgenFreueIchMichAuf} onUpdated={onMyTextFieldUpdated} title={MORGEN_FREUE_ICH_MICH_AUF} helperText={MORGEN_FREUE_ICH_MICH_AUF} />
    </>
}