import { useEffect, useRef, useState } from "react";
import { Eintrag, EintragService, OpenAPI } from "../client";
import MyMultipleLinesTextField from "../components/MyMultipleLinesTextField";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../common/Helpers";
import { DAS_NEHME_ICH_MIR_HEUTE_VOR, DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG, DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN, EINE_POSITIVE_AFFIRMATION, HEUTE_WIRD_GUT_WEIL, MORGEN_FREUE_ICH_MICH_AUF, PAULO_CUELHO } from "../strings/Eintrag";
import { Card, CardContent, CardHeader, Container, TextField } from "@mui/material";
import { VARIANT } from "../strings/Constants";


export default function EintragDetail(props: { onEditEintrag: (value: string) => void }) {
    const [cookies] = useCookies(['token'])
    const navigate = useNavigate();
    let { dateParam } = useParams();
    const date = useRef(dateParam);

    const [eintrag, setEintrag] = useState<Eintrag>({
        datum: formatDate(), dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin: ["", "", ""], dasNehmeIchMirHeuteVor: "", heuteWirdGutWeil: "", einePositiveAffirmation: "", spruch: PAULO_CUELHO, dieSchoenstenMomenteAmHeutigenTag: ["", "", ""], morgenFreueIchMichAuf: ""
    });

    useEffect(() => {
        if (!cookies.token) {
            navigate("/signin");
            return;
        }
        OpenAPI.TOKEN = cookies.token;

        if (!date.current || date.current === 'today') {
            date.current = formatDate();
            props.onEditEintrag(date.current);
            navigate(`/${date.current}`);
            return;
        }
        props.onEditEintrag(date.current);
        window.scrollTo(0, 0)

        async function getEintrag() {
            try {
                const eintrag = await EintragService.eintragGetEintrag({ datum: date.current! });
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

    function EintragRowSingle(props: { title: string, value: string | undefined, helperText: string }) {
        function MyTextField(props: { title: string, helperText: string, value: string | undefined, onUpdated: (title: string, value: string) => void }) {
            function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) {
                const value = event!.target.value;
                props.onUpdated(props.title, value);
            }

            return <TextField multiline className="textfield" defaultValue={props.value} variant={VARIANT} helperText={props.helperText} onChange={onChange} />
        }

        return <Card sx={{ mb: 2 }}>
            <CardHeader title={props.title} sx={{ textTransform: 'uppercase' }} />
            <CardContent>
                <MyTextField value={props.value} onUpdated={onMyTextFieldUpdated} title={props.title} helperText={props.helperText} />
            </CardContent>
        </Card>
    }

    function EintragRowMulti(props: { title: string, values: Array<string> | undefined, helperText: string }) {
        return <Card sx={{ mb: 2 }}>
            <CardHeader title={props.title} sx={{ textTransform: 'uppercase' }} />
            <CardContent>
                <MyMultipleLinesTextField values={props.values} onUpdated={onMyMultipleLinesTextFieldUpdated} title={props.title} helperText={props.helperText} />
            </CardContent>
        </Card>
    }


    return <Card sx={{ mb: 10, mt: 2 }}>
        <CardHeader
            title={date.current}
        />
        <CardContent>
            <EintragRowMulti values={eintrag.dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin} title={DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN} helperText={DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN} />
            <EintragRowSingle title={DAS_NEHME_ICH_MIR_HEUTE_VOR} value={eintrag.dasNehmeIchMirHeuteVor} helperText={DAS_NEHME_ICH_MIR_HEUTE_VOR} />
            <EintragRowSingle title={HEUTE_WIRD_GUT_WEIL} value={eintrag.heuteWirdGutWeil} helperText={HEUTE_WIRD_GUT_WEIL} />

            <Container className="spruch" maxWidth="sm">
                <h1><i>{eintrag.spruch}</i></h1>
            </Container>

            <EintragRowSingle title={EINE_POSITIVE_AFFIRMATION} value={eintrag.einePositiveAffirmation} helperText={EINE_POSITIVE_AFFIRMATION} />
            <EintragRowMulti values={eintrag.dieSchoenstenMomenteAmHeutigenTag} title={DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG} helperText={DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG} />
            <EintragRowSingle title={MORGEN_FREUE_ICH_MICH_AUF} value={eintrag.morgenFreueIchMichAuf} helperText={MORGEN_FREUE_ICH_MICH_AUF} />

        </CardContent>
    </Card>
}