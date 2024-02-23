import { Eintrag } from "../client";
import MyMultipleLinesTextField from "../components/MyMultipleLinesTextField";
import { SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG, TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE, ICH_BIN_DANKBAR_FUER, WAS_HABE_ICH_HEUTE_GUTES_GETAN, POSITIVE_SELBSTBEKRAEFTIGUNG, WAS_HABE_ICH_HEUTE_GELERNT } from "../strings/Eintrag";
import { Card, CardContent, CardHeader, Paper, TextField, Typography } from "@mui/material";
import { VARIANT } from "../strings/Constants";


export default function EintragEditor(props: { eintrag: Eintrag, onEditEintrag: (eintrag: Eintrag) => void }) {
    async function onMyMultipleLinesTextFieldUpdated(title: string, row: number, value: string) {
        if (title === ICH_BIN_DANKBAR_FUER) {
            if (!props.eintrag.ich_bin_dankbar_fuer) {
                props.eintrag.ich_bin_dankbar_fuer = new Array(row)
            }
            props.eintrag.ich_bin_dankbar_fuer[row] = value;
        } else if (title === TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE) {
            if (!props.eintrag.tolle_dinge_die_ich_heute_erlebt_habe) {
                props.eintrag.tolle_dinge_die_ich_heute_erlebt_habe = new Array(row)
            }
            props.eintrag.tolle_dinge_die_ich_heute_erlebt_habe[row] = value;
        } else {
            throw new Error("Unknown MyTextField updated: " + title)
        }

        props.onEditEintrag(props.eintrag);
    }

    async function onMyTextFieldUpdated(title: string, value: string) {
        if (title === SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG) {
            props.eintrag.so_sorge_ich_fuer_einen_guten_tag = value;
        } else if (title === POSITIVE_SELBSTBEKRAEFTIGUNG) {
            props.eintrag.positive_selbstbekraeftigung = value;
        } else if (title === WAS_HABE_ICH_HEUTE_GUTES_GETAN) {
            props.eintrag.was_habe_ich_heute_gutes_getan = value;
        } else if (title === WAS_HABE_ICH_HEUTE_GELERNT) {
            props.eintrag.was_habe_ich_heute_gelernt = value;
        } else {
            throw new Error("Unknown MyTextField updated: " + title)
        }

        props.onEditEintrag(props.eintrag);
    }

    function EintragRowSingle(props: { title: string, value: string | undefined, helperText: string }) {
        function MyTextField(props: { title: string, helperText: string, value: string | undefined, onUpdated: (title: string, value: string) => void }) {
            function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) {
                const value = event!.target.value;
                props.onUpdated(props.title, value);
            }

            return <TextField className="textfield" defaultValue={props.value} variant={VARIANT} helperText={props.helperText} onChange={onChange} />
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

    function Spruch(props: { value: string | undefined }) {
        return <Typography sx={{ textTransform: 'uppercase', m: 10, fontStyle: 'italic' }} textAlign="center" variant="h5" >
            {props.value}
        </Typography>
    }

    return <>
        <EintragRowMulti values={props.eintrag.ich_bin_dankbar_fuer} title={ICH_BIN_DANKBAR_FUER} helperText={ICH_BIN_DANKBAR_FUER} />
        <EintragRowSingle title={SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG} value={props.eintrag.so_sorge_ich_fuer_einen_guten_tag} helperText={SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG} />
        <EintragRowSingle title={POSITIVE_SELBSTBEKRAEFTIGUNG} value={props.eintrag.positive_selbstbekraeftigung} helperText={POSITIVE_SELBSTBEKRAEFTIGUNG} />

        <Spruch value={props.eintrag.spruch} />

        <EintragRowSingle title={WAS_HABE_ICH_HEUTE_GUTES_GETAN} value={props.eintrag.was_habe_ich_heute_gutes_getan} helperText={WAS_HABE_ICH_HEUTE_GUTES_GETAN} />
        <EintragRowSingle title={WAS_HABE_ICH_HEUTE_GELERNT} value={props.eintrag.was_habe_ich_heute_gelernt} helperText={WAS_HABE_ICH_HEUTE_GELERNT} />
        <EintragRowMulti values={props.eintrag.tolle_dinge_die_ich_heute_erlebt_habe} title={TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE} helperText={TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE} />
    </>
}