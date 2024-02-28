import { useEffect, useState } from "react";
import { Daily, DailyService, OpenAPI } from "../client";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../common/Helpers";
import { Alert, Card, CardActions, CardContent, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import DailyEditor from "../components/DailyEditor";
import { Check, Delete } from "@mui/icons-material";
import ExpandMoreButton from "../components/ExpandMoreButton";

export default function DailyComponent() {
    const [cookies] = useCookies(['sechs_minuten_tagebuch_token'])
    const navigate = useNavigate();
    let { date } = useParams();
    const [errors, setErrors] = useState<Array<string>>([])
    const [expanded, setExpanded] = useState(false);
    const [daily, setDaily] = useState<Daily>({
        datum: date!,
        ich_bin_dankbar_fuer: ["", "", ""],
        so_sorge_ich_fuer_einen_guten_tag: "",
        positive_selbstbekraeftigung: "",
        spruch: "",
        was_habe_ich_heute_gutes_getan: "",
        was_habe_ich_heute_gelernt: "",
        tolle_dinge_die_ich_heute_erlebt_habe: ["", "", ""],
        notizen: ""
    });

    async function getDaily() {
        setErrors([]);
        try {
            const dailyOnServer = await DailyService.dailyGetDaily({ datum: date! });
            setDaily(dailyOnServer);
        } catch (e) {
            try {
                const dailyOnServer = await DailyService.dailyPostDaily({ requestBody: daily.datum! });
                setDaily(dailyOnServer);
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

        getDaily();
        // eslint-disable-next-line
    }, []);


    async function onChangeDate(value: Moment | null) {
        if (!value) {
            return;
        }
        daily.datum = formatDate(value);
        navigate(`/daily/${daily.datum}`);
    }

    async function onEditDaily(value: Daily) {
        setDaily(value);
        try {
            await DailyService.dailyPostDaily({ requestBody: daily });
        } catch (e) {
            errors.push(`${e}`);
        }
    }

    async function onDeleteDaily(value: string) {
        try {
            await DailyService.dailyDeleteDaily({ date: value })
            navigate('/');
        } catch (e) {
            errors.push(`${e}`);
        }
    }

    return <Card>
        <CardContent >
            <DatePicker value={moment(daily.datum)} onChange={onChangeDate} sx={{ mb: 2 }} />
            {errors.map((e) => <Alert severity="error">{e}</Alert>)}
            <DailyEditor daily={daily} onEditDaily={onEditDaily} expanded={expanded}></DailyEditor>

            <CardActions disableSpacing>
                <IconButton aria-label="share" sx={{}} onClick={() => onDeleteDaily(daily.datum)} >
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