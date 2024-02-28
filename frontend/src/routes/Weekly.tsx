import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Check, Delete } from "@mui/icons-material";
import ExpandMoreButton from "../components/ExpandMoreButton";
import { OpenAPI, Weekly, WeeklyService } from "../client";
import WeeklyEditor from "../components/WeeklyEditor";
import { weekToDate } from "../common/Helpers";


export default function WeeklyComponent() {
    const [cookies] = useCookies(['sechs_minuten_tagebuch_token'])
    const navigate = useNavigate();
    let { week } = useParams();
    const [errors, setErrors] = useState<Array<string>>([])
    const [expanded, setExpanded] = useState(false);

    week = weekToDate(week)

    const [weekly, setWeekly] = useState<Weekly>({
        woche: week,
        notizen: "",
        wochenreflexion: {
            meine_highlights_und_erfolge_der_woche: "",
            skala_wie_glücklich: 0,
            text_wie_glücklich: ""
        },
        wochenplanung: {
            darauf_freue_ich_mich: "",
            so_sorge_ich_fuer_eine_gute_woche: {
                berufsleben: "",
                privatleben: ""
            }
        }
    });

    async function getWeekly() {
        setErrors([]);
        try {
            const weeklyOnServer = await WeeklyService.weeklyGetWeekly({ datum: week! });
            setWeekly(weeklyOnServer);
        } catch (e) {
            errors.push(`${e}`);
        }
    };

    useEffect(() => {
        if (!cookies.sechs_minuten_tagebuch_token) {
            navigate("/signin");
            return;
        }
        OpenAPI.TOKEN = cookies.sechs_minuten_tagebuch_token;

        window.scrollTo(0, 0);

        getWeekly();
        // eslint-disable-next-line
    }, []);

    async function onEditWeekly(value: Weekly) {
        setWeekly(value);
        try {
            await WeeklyService.weeklyPostWeekly({ requestBody: weekly });
        } catch (e) {
            errors.push(`${e}`);
        }
    }

    async function onDeleteWeekly(value: string) {
        try {
            await WeeklyService.weeklyDeleteWeekly({ date: value })
            navigate('/');
        } catch (e) {
            errors.push(`${e}`);
        }
    }

    return <Card>
        <CardContent >
            {errors.map((e) => <Alert severity="error">{e}</Alert>)}
            <WeeklyEditor weekly={weekly} onEditWeekly={onEditWeekly} expanded={expanded}></WeeklyEditor>

            <CardActions disableSpacing>
                <IconButton aria-label="share" sx={{}} onClick={() => onDeleteWeekly(weekly.woche)} >
                    <Delete />
                </IconButton>
                <ExpandMoreButton expanded={expanded} handleExpandClick={() => setExpanded(!expanded)} />
                <IconButton aria-label="share" sx={{ ml: 'auto' }} onClick={() => navigate('/')} >
                    <Check />
                </IconButton>
            </CardActions>
        </CardContent>
    </Card >
}