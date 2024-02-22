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
import { DAS_NEHME_ICH_MIR_HEUTE_VOR, DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG, DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN, EINE_POSITIVE_AFFIRMATION, HEUTE_WIRD_GUT_WEIL, MORGEN_FREUE_ICH_MICH_AUF } from "../strings/Eintrag";
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
            <EintragRow heading={DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN} values={props.eintrag.dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin} />
            <EintragRow heading={DAS_NEHME_ICH_MIR_HEUTE_VOR} values={props.eintrag.dasNehmeIchMirHeuteVor} />
            <EintragRow heading={HEUTE_WIRD_GUT_WEIL} values={props.eintrag.heuteWirdGutWeil} />
            <EintragRow heading="" values={props.eintrag.spruch} italic />
            <EintragRow heading={EINE_POSITIVE_AFFIRMATION} values={props.eintrag.einePositiveAffirmation} />
            <EintragRow heading={DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG} values={props.eintrag.dieSchoenstenMomenteAmHeutigenTag} />
            <EintragRow heading={MORGEN_FREUE_ICH_MICH_AUF} values={props.eintrag.morgenFreueIchMichAuf} />
        </Box>
    }

    function onEdit(value: any) {
        navigate(value);
    }

    return (
        <Card sx={{ m: 2 }}>
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