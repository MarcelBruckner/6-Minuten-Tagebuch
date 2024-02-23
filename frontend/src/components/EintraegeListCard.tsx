import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Edit from '@mui/icons-material/Edit';
import { SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG, TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE, ICH_BIN_DANKBAR_FUER, WAS_HABE_ICH_HEUTE_GUTES_GETAN, POSITIVE_SELBSTBEKRAEFTIGUNG, WAS_HABE_ICH_HEUTE_GELERNT } from "../strings/Eintrag";
import { Eintrag } from '../client';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function EintraegeListCard(props: { eintrag: Eintrag }) {
    const navigate = useNavigate();

    function EintragRow(props: { heading: string, values: Array<string> | string | undefined, italic?: boolean }) {
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

    function EintragCard(props: { eintrag: Eintrag }) {
        return <Box>
            <EintragRow heading={ICH_BIN_DANKBAR_FUER} values={props.eintrag.ich_bin_dankbar_fuer} />
            <EintragRow heading={SO_SORGE_ICH_FUER_EINEN_GUTEN_TAG} values={props.eintrag.so_sorge_ich_fuer_einen_guten_tag} />
            <EintragRow heading={POSITIVE_SELBSTBEKRAEFTIGUNG} values={props.eintrag.positive_selbstbekraeftigung} />
            <EintragRow heading="" values={props.eintrag.spruch} italic />
            <EintragRow heading={WAS_HABE_ICH_HEUTE_GUTES_GETAN} values={props.eintrag.was_habe_ich_heute_gutes_getan} />
            <EintragRow heading={WAS_HABE_ICH_HEUTE_GELERNT} values={props.eintrag.was_habe_ich_heute_gelernt} />
            <EintragRow heading={TOLLE_DINGE_DIE_ICH_HEUTE_ERLEBT_HABE} values={props.eintrag.tolle_dinge_die_ich_heute_erlebt_habe} />
        </Box>
    }

    function onEdit(value: any) {
        navigate(value);
    }

    return (
        <Card sx={{ mb: 2 }}>
            <CardHeader
                title={props.eintrag.datum}
            />
            <CardContent>
                <EintragCard eintrag={props.eintrag}></EintragCard>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" disabled>
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share" disabled>
                    <ShareIcon />
                </IconButton>
                <IconButton aria-label="share" sx={{ ml: 'auto' }} id={`${props.eintrag.datum}-edit`} onClick={() => onEdit(props.eintrag.datum)} >
                    <Edit />
                </IconButton>
            </CardActions>
        </Card>
    );
}