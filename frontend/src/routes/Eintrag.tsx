import { useEffect, useState } from "react";
import { Eintrag, EintragService, OpenAPI } from "../client";
import MyMultipleLinesTextField from "../components/MyMultipleLinesTextField";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate, get_random_quote as getRandomQuote } from "../common/Helpers";
import { SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG, TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE, ICH_BIN_DANKBAR_FUER, WAS_HABE_ICH_HEUTE_GUTES_GETAN, POSITIVE_SELBSTBEKRAEFTIGUNG, WAS_HABE_ICH_HEUTE_GELERNT } from "../strings/Eintrag";
import { Card, CardContent, CardHeader, Container, TextField } from "@mui/material";
import { VARIANT } from "../strings/Constants";


export default function EintragDetail(props: { onEditEintrag: (value: string) => void }) {
    const [cookies] = useCookies(['sechs_minuten_tagebuch_token'])
    const navigate = useNavigate();
    let { date } = useParams();


    const [eintrag, setEintrag] = useState<Eintrag>({
        datum: formatDate(),
        ich_bin_dankbar_fuer: ["", "", ""],
        so_sorge_ich_fuer_einen_guten_tag: "",
        positive_selbstbekraeftigung: "",
        spruch: getRandomQuote(),
        was_habe_ich_heute_gutes_getan: "",
        was_habe_ich_heute_gelernt: "",
        tolle_dinge_die_ich_heute_erlebt_habe: ["", "", ""],
    });

    useEffect(() => {
        if (!cookies.sechs_minuten_tagebuch_token) {
            navigate("/signin");
            return;
        }
        OpenAPI.TOKEN = cookies.sechs_minuten_tagebuch_token;

        if (!date) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            date = formatDate();
            props.onEditEintrag(date);
            navigate(`/${date}`);
            return;
        }
        props.onEditEintrag(date);
        window.scrollTo(0, 0)

        async function getEintrag() {
            try {
                const eintrag = await EintragService.eintragGetEintrag({ datum: date! });
                setEintrag(eintrag);
            } catch (e) {
                try {
                    await EintragService.eintragPutEintrag({ requestBody: eintrag });
                } catch (e) {
                }
            }
        };
        getEintrag();
    }, [cookies, navigate, props, date]);

    async function onMyMultipleLinesTextFieldUpdated(title: string, row: number, value: string) {
        if (title === ICH_BIN_DANKBAR_FUER) {
            if (!eintrag.ich_bin_dankbar_fuer) {
                eintrag.ich_bin_dankbar_fuer = new Array(row)
            }
            eintrag.ich_bin_dankbar_fuer[row] = value;
        } else if (title === TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE) {
            if (!eintrag.tolle_dinge_die_ich_heute_erlebt_habe) {
                eintrag.tolle_dinge_die_ich_heute_erlebt_habe = new Array(row)
            }
            eintrag.tolle_dinge_die_ich_heute_erlebt_habe[row] = value;
        } else {
            throw new Error("Unknown MyTextField updated: " + title)
        }

        setEintrag(eintrag);
        await EintragService.eintragPutEintrag({ requestBody: eintrag });
    }

    async function onMyTextFieldUpdated(title: string, value: string) {
        if (title === SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG) {
            eintrag.so_sorge_ich_fuer_einen_guten_tag = value;
        } else if (title === POSITIVE_SELBSTBEKRAEFTIGUNG) {
            eintrag.positive_selbstbekraeftigung = value;
        } else if (title === WAS_HABE_ICH_HEUTE_GUTES_GETAN) {
            eintrag.was_habe_ich_heute_gutes_getan = value;
        } else if (title === WAS_HABE_ICH_HEUTE_GELERNT) {
            eintrag.was_habe_ich_heute_gelernt = value;
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
            title={date}
        />
        <CardContent>
            <EintragRowMulti values={eintrag.ich_bin_dankbar_fuer} title={ICH_BIN_DANKBAR_FUER} helperText={ICH_BIN_DANKBAR_FUER} />
            <EintragRowSingle title={SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG} value={eintrag.so_sorge_ich_fuer_einen_guten_tag} helperText={SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG} />
            <EintragRowSingle title={POSITIVE_SELBSTBEKRAEFTIGUNG} value={eintrag.positive_selbstbekraeftigung} helperText={POSITIVE_SELBSTBEKRAEFTIGUNG} />

            <Container className="spruch" maxWidth="sm">
                <h1><i>{eintrag.spruch}</i></h1>
            </Container>

            <EintragRowSingle title={WAS_HABE_ICH_HEUTE_GUTES_GETAN} value={eintrag.was_habe_ich_heute_gutes_getan} helperText={WAS_HABE_ICH_HEUTE_GUTES_GETAN} />
            <EintragRowSingle title={WAS_HABE_ICH_HEUTE_GELERNT} value={eintrag.was_habe_ich_heute_gelernt} helperText={WAS_HABE_ICH_HEUTE_GELERNT} />
            <EintragRowMulti values={eintrag.tolle_dinge_die_ich_heute_erlebt_habe} title={TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE} helperText={TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE} />

        </CardContent>
    </Card>
}