import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Edit from '@mui/icons-material/Edit';
import { SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG, TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE, ICH_BIN_DANKBAR_FUER, WAS_HABE_ICH_HEUTE_GUTES_GETAN, POSITIVE_SELBSTBEKRAEFTIGUNG, WAS_HABE_ICH_HEUTE_GELERNT, NOTIZEN } from "../strings/Daily";
import { Daily } from '../client';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function EintraegeListCard(props: { Daily: Daily }) {
    const navigate = useNavigate();

    function DailyRow(props: { heading: string, values: Array<string> | string | undefined, italic?: boolean }) {
        if (!props.values) {
            return <Box></Box>;
        }
        let content;
        if (typeof props.values === "string") {
            content = props.values;
        } else {
            const values = props.values.filter(String);
            if (!values.length) {
                return <Box></Box>;
            }
            content = <Box>
                {
                    values.map((value, i) => <Box>{i + 1}. {value}</Box >)
                }
            </Box>
        }

        let sx = props.italic ? { fontStyle: 'italic' } : {}
        return <Box sx={{ mb: 2 }}>
            <Typography sx={{ textTransform: 'uppercase' }} variant="body2" color="text.secondary" >{props.heading}</Typography>
            <Typography sx={sx}>{content}</Typography>
        </Box>
    }

    function DailyCard(props: { Daily: Daily }) {
        return <Box>
            <DailyRow heading={ICH_BIN_DANKBAR_FUER} values={props.Daily.ich_bin_dankbar_fuer} />
            <DailyRow heading={SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG} values={props.Daily.so_sorge_ich_fuer_einen_guten_tag} />
            <DailyRow heading={POSITIVE_SELBSTBEKRAEFTIGUNG} values={props.Daily.positive_selbstbekraeftigung} />
            <DailyRow heading="" values={props.Daily.spruch} italic />
            <DailyRow heading={WAS_HABE_ICH_HEUTE_GUTES_GETAN} values={props.Daily.was_habe_ich_heute_gutes_getan} />
            <DailyRow heading={WAS_HABE_ICH_HEUTE_GELERNT} values={props.Daily.was_habe_ich_heute_gelernt} />
            <DailyRow heading={TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE} values={props.Daily.tolle_dinge_die_ich_heute_erlebt_habe} />
            <DailyRow heading={NOTIZEN} values={props.Daily.notizen} />
        </Box>
    }

    function onEdit(value: any) {
        navigate(`/daily/${value}`);
    }

    return (
        <Card sx={{ mb: 2 }}>
            <CardHeader
                title={props.Daily.datum}
            />
            <CardContent>
                <DailyCard Daily={props.Daily}></DailyCard>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" disabled>
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share" disabled>
                    <ShareIcon />
                </IconButton>
                <IconButton aria-label="share" sx={{ ml: 'auto' }} id={`${props.Daily.datum}-edit`} onClick={() => onEdit(props.Daily.datum)} >
                    <Edit />
                </IconButton>
            </CardActions>
        </Card>
    );
}