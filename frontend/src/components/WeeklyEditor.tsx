import { Weekly } from "../client";
import { NOTIZEN } from "../strings/Daily";
import { DARAUF_FREUE_ICH_MICH, MEINE_HIGHLIGHTS_UND_ERFOLGE_DER_WOCHE, SKALA_VON_EINS_BIS_ZEHN, SO_SORGE_ICH_FUER_EINE_GUTE_WOCHE_BERUFSLEBEN, SO_SORGE_ICH_FUER_EINE_GUTE_WOCHE_PRIVATLEBEN, WOCHENPLANUNG, WOCHENREFLEXION } from "../strings/Weekly";
import { Card, CardHeader, CardContent, Typography, Slider, TextField } from "@mui/material";
import { VARIANT } from "../strings/Constants";
import SingleRowEntry from "./SingleRowEntry";


export default function WeeklyEditor(props: { weekly: Weekly, onEditWeekly: (weekly: Weekly) => void, expanded: boolean }) {
    async function onMyTextFieldUpdated(title: string, value: string) {
        if (title === MEINE_HIGHLIGHTS_UND_ERFOLGE_DER_WOCHE) {
            props.weekly.wochenreflexion!.meine_highlights_und_erfolge_der_woche = value;
        } else if (title === SKALA_VON_EINS_BIS_ZEHN) {
            props.weekly.wochenreflexion!.text_wie_glücklich = value;
        } else if (title === SO_SORGE_ICH_FUER_EINE_GUTE_WOCHE_BERUFSLEBEN) {
            props.weekly.wochenplanung!.so_sorge_ich_fuer_eine_gute_woche!.berufsleben = value;
        } else if (title === SO_SORGE_ICH_FUER_EINE_GUTE_WOCHE_PRIVATLEBEN) {
            props.weekly.wochenplanung!.so_sorge_ich_fuer_eine_gute_woche!.privatleben = value;
        } else if (title === DARAUF_FREUE_ICH_MICH) {
            props.weekly.wochenplanung!.darauf_freue_ich_mich = value;
        } else if (title === NOTIZEN) {
            props.weekly.notizen = value;
        } else {
            throw new Error("Unknown MyTextField updated: " + title)
        }

        props.onEditWeekly(props.weekly);
    }

    function SingleRowEntryWithSlider(props: { title: string, textValue: string | undefined, helperText: string, multiline?: boolean, onTextChange: (title: string, value: string) => void, sliderValue: number | undefined, onSliderChange: (value: number) => void }) {
        function onSliderChange(_event: any, value: number | number[]) {
            props.onSliderChange(value as number);
        }

        return <Card sx={{ mb: 2 }}>
            <CardHeader title={props.title} sx={{ textTransform: 'uppercase' }} />
            <CardContent>
                <Slider
                    aria-label={SKALA_VON_EINS_BIS_ZEHN}
                    defaultValue={props.sliderValue}
                    valueLabelDisplay="auto"
                    shiftStep={1}
                    step={1}
                    marks
                    min={1}
                    max={10}
                    sx={{ mb: 2 }}
                    onChange={onSliderChange}
                />
                <TextField
                    multiline={props.multiline}
                    className="textfield"
                    defaultValue={props.textValue}
                    variant={VARIANT}
                    helperText={props.helperText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => props.onTextChange(props.title, e!.target.value)}
                    title={props.title} />
            </CardContent>
        </Card>
    }

    function onSliderChange(value: number) {
        props.weekly.wochenreflexion!.skala_wie_glücklich = value
        props.onEditWeekly(props.weekly);
    }


    return <>
        <Typography sx={{ textTransform: 'uppercase', mb: 2 }} textAlign="center" variant="h5" >{WOCHENREFLEXION}</Typography>
        <SingleRowEntry title={MEINE_HIGHLIGHTS_UND_ERFOLGE_DER_WOCHE} value={props.weekly.wochenreflexion!.meine_highlights_und_erfolge_der_woche} helperText={MEINE_HIGHLIGHTS_UND_ERFOLGE_DER_WOCHE} onChange={onMyTextFieldUpdated} multiline />
        <SingleRowEntryWithSlider
            title={SKALA_VON_EINS_BIS_ZEHN}
            textValue={props.weekly.wochenreflexion!.text_wie_glücklich}
            helperText={SKALA_VON_EINS_BIS_ZEHN}
            onTextChange={onMyTextFieldUpdated}
            sliderValue={props.weekly.wochenreflexion!.skala_wie_glücklich}
            onSliderChange={onSliderChange} />

        <Typography sx={{ textTransform: 'uppercase', mb: 2, mt: 4 }} textAlign="center" variant="h5" >{WOCHENPLANUNG}</Typography>
        <SingleRowEntry multiline title={SO_SORGE_ICH_FUER_EINE_GUTE_WOCHE_BERUFSLEBEN} value={props.weekly.wochenplanung!.so_sorge_ich_fuer_eine_gute_woche!.berufsleben} helperText={SO_SORGE_ICH_FUER_EINE_GUTE_WOCHE_BERUFSLEBEN} onChange={onMyTextFieldUpdated} />
        <SingleRowEntry multiline title={SO_SORGE_ICH_FUER_EINE_GUTE_WOCHE_PRIVATLEBEN} value={props.weekly.wochenplanung!.so_sorge_ich_fuer_eine_gute_woche!.privatleben} helperText={SO_SORGE_ICH_FUER_EINE_GUTE_WOCHE_PRIVATLEBEN} onChange={onMyTextFieldUpdated} />
        <SingleRowEntry multiline title={DARAUF_FREUE_ICH_MICH} value={props.weekly.wochenplanung!.darauf_freue_ich_mich} helperText={DARAUF_FREUE_ICH_MICH} onChange={onMyTextFieldUpdated} />

        {props.expanded && <SingleRowEntry title={NOTIZEN} value={props.weekly.notizen} helperText={NOTIZEN} multiline onChange={onMyTextFieldUpdated} />}
    </>
}