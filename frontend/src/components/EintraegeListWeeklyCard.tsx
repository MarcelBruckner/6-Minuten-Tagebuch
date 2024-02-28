import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Edit from '@mui/icons-material/Edit';
import { NOTIZEN } from "../strings/Daily";
import { Weekly } from '../client';
import { Box, Slider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatWeek, } from '../common/Helpers';
import { DARAUF_FREUE_ICH_MICH, MEINE_HIGHLIGHTS_UND_ERFOLGE_DER_WOCHE, SKALA_VON_EINS_BIS_ZEHN, SO_SORGE_ICH_FUER_EINE_GUTE_WOCHE_BERUFSLEBEN, SO_SORGE_ICH_FUER_EINE_GUTE_WOCHE_PRIVATLEBEN, WOCHENPLANUNG, WOCHENREFLEXION } from '../strings/Weekly';

export default function EintraegeListWeeklyCard(props: { weekly: Weekly }) {
    const navigate = useNavigate();

    function WeeklyRow(props: { heading: string, value: string | undefined, italic?: boolean }) {
        if (!props.value) {
            return <></>
        }
        return <Box sx={{ mb: 2 }}>
            <Typography sx={{ textTransform: 'uppercase' }} variant="body2" color="text.secondary" >{props.heading}</Typography>
            <Typography component={'div'}>{props.value}</Typography>
        </Box>
    }

    function WeeklyRowWithSlider(props: { heading: string, textValue: string | undefined, sliderValue: number | undefined, italic?: boolean }) {
        if (props.sliderValue! < 1) {
            return <WeeklyRow heading={props.heading} value={props.textValue} />
        }
        return <Box sx={{ mb: 2 }}>
            <Typography sx={{ textTransform: 'uppercase' }} variant="body2" color="text.secondary" >{props.heading}</Typography>
            <Slider
                aria-label={props.heading}
                value={props.sliderValue}
                valueLabelDisplay="auto"
                disabled
                shiftStep={1}
                step={1}
                marks
                min={1}
                max={10}
            />
            <Typography component={'div'}>{props.textValue}</Typography>
        </Box>
    }

    function Heading(props: { value: string }) {
        return <Typography sx={{ textTransform: 'uppercase', mb: 2 }} textAlign='center' variant="body2" color="text.secondary" >{props.value}</Typography>
    }

    function Wochenreflexion(props: { weekly: Weekly }) {
        if (props.weekly.wochenreflexion!.meine_highlights_und_erfolge_der_woche
            || props.weekly.wochenreflexion!.text_wie_glücklich
            || props.weekly.wochenreflexion!.skala_wie_glücklich) {
            return <>
                <Heading value={WOCHENREFLEXION} />
                <WeeklyRow heading={MEINE_HIGHLIGHTS_UND_ERFOLGE_DER_WOCHE} value={props.weekly.wochenreflexion!.meine_highlights_und_erfolge_der_woche} />
                <WeeklyRowWithSlider heading={SKALA_VON_EINS_BIS_ZEHN} textValue={props.weekly.wochenreflexion!.text_wie_glücklich} sliderValue={props.weekly.wochenreflexion!.skala_wie_glücklich} />
            </>
        }
        return <></>
    }

    function Wochenplanung(props: { weekly: Weekly }) {
        if (props.weekly.wochenplanung!.so_sorge_ich_fuer_eine_gute_woche!.berufsleben
            || props.weekly.wochenplanung!.so_sorge_ich_fuer_eine_gute_woche!.privatleben
            || props.weekly.wochenplanung!.darauf_freue_ich_mich) {
            return <>
                <Heading value={WOCHENPLANUNG} />
                <WeeklyRow heading={SO_SORGE_ICH_FUER_EINE_GUTE_WOCHE_BERUFSLEBEN} value={props.weekly.wochenplanung!.so_sorge_ich_fuer_eine_gute_woche!.berufsleben} />
                <WeeklyRow heading={SO_SORGE_ICH_FUER_EINE_GUTE_WOCHE_PRIVATLEBEN} value={props.weekly.wochenplanung!.so_sorge_ich_fuer_eine_gute_woche!.privatleben} />
                <WeeklyRow heading={DARAUF_FREUE_ICH_MICH} value={props.weekly.wochenplanung!.darauf_freue_ich_mich} />
            </>
        }
        return <></>
    }

    function WeeklyCard(props: { weekly: Weekly }) {
        return <Box key={formatWeek(props.weekly.woche)}>
            <Wochenreflexion weekly={props.weekly} />
            <Wochenplanung weekly={props.weekly} />
            <WeeklyRow heading={NOTIZEN} value={props.weekly.notizen} />
        </Box >
    }

    function onEdit(value: any) {
        navigate(`/weekly/${value}`);
    }

    return (
        <Card sx={{ mb: 2 }}>
            <CardHeader
                title={formatWeek(props.weekly.woche)}
            />
            <CardContent>
                <WeeklyCard weekly={props.weekly}></WeeklyCard>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" disabled>
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share" disabled>
                    <ShareIcon />
                </IconButton>
                <IconButton aria-label="share" sx={{ ml: 'auto' }} id={`${formatWeek(props.weekly.woche)}-edit`} onClick={() => onEdit(formatWeek(props.weekly.woche))} >
                    <Edit />
                </IconButton>
            </CardActions>
        </Card>
    );
}