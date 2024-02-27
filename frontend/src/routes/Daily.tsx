import { useEffect, useState } from "react";
import { Daily, DailyService, OpenAPI } from "../client";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../common/Helpers";
import { Alert, Card, CardActions, CardContent, IconButton, IconButtonProps, styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import DailyEditor from "../components/DailyEditor";
import { Delete, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function DailyComponent() {
    const [cookies] = useCookies(['sechs_minuten_tagebuch_token'])
    const navigate = useNavigate();
    let { date } = useParams();
    const [errors, setErrors] = useState<Array<string>>([])
    const [expanded, setExpanded] = useState(false);
    const [Daily, setDaily] = useState<Daily>({
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

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    async function getDaily() {
        setErrors([]);
        try {
            const DailyOnServer = await DailyService.dailyGetDaily({ datum: date! });
            setDaily(DailyOnServer);
        } catch (e) {
            try {
                const DailyOnServer = await DailyService.dailyPostDaily({ requestBody: Daily.datum! });
                setDaily(DailyOnServer);
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
            navigate(`/${date}`);
            // return;
        }
        // props.onChangeDate(date);
        window.scrollTo(0, 0)

        getDaily();
    }, [cookies, navigate, date]);


    async function onChangeDate(value: Moment | null) {
        if (!value) {
            return;
        }
        Daily.datum = formatDate(value);
        navigate(`/daily/${Daily.datum}`);
    }

    async function onEditDaily(value: Daily) {
        setDaily(value);
        try {
            await DailyService.dailyPostDaily({ requestBody: Daily });
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
            <DatePicker value={moment(Daily.datum)} onChange={onChangeDate} sx={{ mb: 2 }} />
            {errors.map((e) => <Alert severity="error">{e}</Alert>)}
            <DailyEditor daily={Daily} onEditDaily={onEditDaily} expanded={expanded}></DailyEditor>

            <CardActions disableSpacing>
                <IconButton aria-label="share" sx={{ ml: 'auto' }} onClick={() => onDeleteDaily(Daily.datum)} >
                    <Delete />
                </IconButton>
                <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
        </CardContent>
    </Card >
}