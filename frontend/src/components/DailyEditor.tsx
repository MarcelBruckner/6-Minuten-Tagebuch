import { Daily } from "../client";
import MyMultipleLinesTextField from "./MyMultipleLinesTextField";
import { SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG, TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE, ICH_BIN_DANKBAR_FUER, WAS_HABE_ICH_HEUTE_GUTES_GETAN, POSITIVE_SELBSTBEKRAEFTIGUNG, WAS_HABE_ICH_HEUTE_GELERNT, NOTIZEN } from "../strings/Daily";
import { Card, CardContent, CardHeader, TextField, Typography } from "@mui/material";
import { VARIANT } from "../strings/Constants";


export default function DailyEditor(props: { daily: Daily, onEditDaily: (daily: Daily) => void, expanded: boolean }) {
    async function onMyMultipleLinesTextFieldUpdated(title: string, row: number, value: string) {
        if (title === ICH_BIN_DANKBAR_FUER) {
            if (!props.daily.ich_bin_dankbar_fuer) {
                props.daily.ich_bin_dankbar_fuer = new Array(row)
            }
            props.daily.ich_bin_dankbar_fuer[row] = value;
        } else if (title === TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE) {
            if (!props.daily.tolle_dinge_die_ich_heute_erlebt_habe) {
                props.daily.tolle_dinge_die_ich_heute_erlebt_habe = new Array(row)
            }
            props.daily.tolle_dinge_die_ich_heute_erlebt_habe[row] = value;
        } else {
            throw new Error("Unknown MyTextField updated: " + title)
        }

        props.onEditDaily(props.daily);
    }

    async function onMyTextFieldUpdated(title: string, value: string) {
        if (title === SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG) {
            props.daily.so_sorge_ich_fuer_einen_guten_tag = value;
        } else if (title === POSITIVE_SELBSTBEKRAEFTIGUNG) {
            props.daily.positive_selbstbekraeftigung = value;
        } else if (title === WAS_HABE_ICH_HEUTE_GUTES_GETAN) {
            props.daily.was_habe_ich_heute_gutes_getan = value;
        } else if (title === WAS_HABE_ICH_HEUTE_GELERNT) {
            props.daily.was_habe_ich_heute_gelernt = value;
        } else if (title === NOTIZEN) {
            props.daily.notizen = value;
        } else {
            throw new Error("Unknown MyTextField updated: " + title)
        }

        props.onEditDaily(props.daily);
    }

    function DailyRowSingle(props: { title: string, value: string | undefined, helperText: string, multiline?: boolean }) {
        return <Card sx={{ mb: 2 }}>
            <CardHeader title={props.title} sx={{ textTransform: 'uppercase' }} />
            <CardContent>
                <TextField
                    multiline={props.multiline}
                    className="textfield"
                    defaultValue={props.value}
                    variant={VARIANT}
                    helperText={props.helperText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => onMyTextFieldUpdated(props.title, e!.target.value)}
                    title={props.title} />
            </CardContent>
        </Card>
    }

    function DailyRowMulti(props: { title: string, values: Array<string> | undefined, helperText: string }) {
        return <Card sx={{ mb: 2 }}>
            <CardHeader title={props.title} sx={{ textTransform: 'uppercase' }} />
            <CardContent>
                <MyMultipleLinesTextField values={props.values} onUpdated={onMyMultipleLinesTextFieldUpdated} title={props.title} helperText={props.helperText} />
            </CardContent>
        </Card>
    }

    function Spruch(props: { value: string | undefined }) {
        return <Typography sx={{ textTransform: 'uppercase', m: 2, mt: 10, mb: 10, fontStyle: 'italic' }} textAlign="center" variant="h5" >
            {props.value}
        </Typography>
    }

    return <>
        <DailyRowMulti values={props.daily.ich_bin_dankbar_fuer} title={ICH_BIN_DANKBAR_FUER} helperText={ICH_BIN_DANKBAR_FUER} />
        <DailyRowSingle title={SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG} value={props.daily.so_sorge_ich_fuer_einen_guten_tag} helperText={SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG} />
        <DailyRowSingle title={POSITIVE_SELBSTBEKRAEFTIGUNG} value={props.daily.positive_selbstbekraeftigung} helperText={POSITIVE_SELBSTBEKRAEFTIGUNG} />

        <Spruch value={props.daily.spruch} />

        <DailyRowSingle title={WAS_HABE_ICH_HEUTE_GUTES_GETAN} value={props.daily.was_habe_ich_heute_gutes_getan} helperText={WAS_HABE_ICH_HEUTE_GUTES_GETAN} />
        <DailyRowSingle title={WAS_HABE_ICH_HEUTE_GELERNT} value={props.daily.was_habe_ich_heute_gelernt} helperText={WAS_HABE_ICH_HEUTE_GELERNT} />
        <DailyRowMulti values={props.daily.tolle_dinge_die_ich_heute_erlebt_habe} title={TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE} helperText={TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE} />

        {props.expanded && <DailyRowSingle title={NOTIZEN} value={props.daily.notizen} helperText={NOTIZEN} multiline />}
    </>
}