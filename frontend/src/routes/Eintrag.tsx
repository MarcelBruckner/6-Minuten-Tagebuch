import { useEffect, useState } from "react";
import { Eintrag, EintragService, OpenAPI } from "../client";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../common/Helpers";
import { Alert, Card, CardActions, CardContent, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import EintragEditor from "../components/EintragEditor";
import { Console } from "console";
import { Delete } from "@mui/icons-material";


export default function EintragDetail(props: { onChangeDate: (value: string) => void, onDeleteEintrag: () => void }) {
    const [cookies] = useCookies(['sechs_minuten_tagebuch_token'])
    const navigate = useNavigate();
    let { date } = useParams();
    const [errors, setErrors] = useState<Array<string>>([])

    const [eintrag, setEintrag] = useState<Eintrag>({
        datum: date!,
        ich_bin_dankbar_fuer: ["", "", ""],
        so_sorge_ich_fuer_einen_guten_tag: "",
        positive_selbstbekraeftigung: "",
        spruch: "",
        was_habe_ich_heute_gutes_getan: "",
        was_habe_ich_heute_gelernt: "",
        tolle_dinge_die_ich_heute_erlebt_habe: ["", "", ""],
    });


    async function getEintrag() {
        setErrors([]);
        try {
            const eintragOnServer = await EintragService.eintragGetEintrag({ datum: date! });
            setEintrag(eintragOnServer);
        } catch (e) {
            try {
                const eintragOnServer = await EintragService.eintragPostEintrag({ requestBody: eintrag.datum! });
                setEintrag(eintragOnServer);
            } catch (e) {
                errors.push(`${e}`);
            }
        }
    };

    useEffect(() => {
        if (!cookies.sechs_minuten_tagebuch_token) {
            navigate("/signin");
            return;
        }
        OpenAPI.TOKEN = cookies.sechs_minuten_tagebuch_token;

        if (!date) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            date = formatDate();
            // props.onChangeDate(date);
            navigate(`/${date}`);
            // return;
        }
        // props.onChangeDate(date);
        window.scrollTo(0, 0)

        getEintrag();
    }, [cookies, navigate, props, date]);


    async function onChangeDate(value: Moment | null) {
        if (!value) {
            return;
        }
        eintrag.datum = formatDate(value);
        navigate(`/${eintrag.datum}`);
        props.onChangeDate(eintrag.datum);
    }

    async function onEditEintrag(value: Eintrag) {
        setEintrag(value);
        props.onChangeDate(value.datum);
        try {
            await EintragService.eintragPostEintrag({ requestBody: eintrag });
        } catch (e) {
            errors.push(`${e}`);
        }
    }

    async function onDeleteEintrag(value: string) {
        try {
            await EintragService.eintragDeleteEintrag({ date: value })
            props.onDeleteEintrag();
            navigate('/');
        } catch (e) {
            errors.push(`${e}`);
        }
    }

    return <Card sx={{ mb: 10, mt: 2 }}>
        <CardContent >
            <DatePicker value={moment(eintrag.datum)} onChange={onChangeDate} sx={{ mb: 2 }} />
            {errors.map((e) => <Alert severity="error">{e}</Alert>)}
            <EintragEditor eintrag={eintrag} onEditEintrag={onEditEintrag}></EintragEditor>
            <CardActions disableSpacing>
                <IconButton aria-label="share" sx={{ ml: 'auto' }} onClick={() => onDeleteEintrag(eintrag.datum)} >
                    <Delete />
                </IconButton>
            </CardActions>
        </CardContent>
    </Card >
}