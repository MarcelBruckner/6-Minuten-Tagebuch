import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Edit from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DAS_NEHME_ICH_MIR_HEUTE_VOR, DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG, DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN, EINE_POSITIVE_AFFIRMATION, HEUTE_WIRD_GUT_WEIL, MORGEN_FREUE_ICH_MICH_AUF } from "../strings/Eintrag";
import { Eintrag } from '../client';
import { Box, Container } from '@mui/material';


export default function EintraegeListCard(props: { eintrag: Eintrag }) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    console.log("Here");

    function Heading(props: { value: string }) {
        return <Typography sx={{ textTransform: 'uppercase' }} variant="body2" color="text.secondary" >
            {props.value}
        </Typography>
    }

    function EintragRow(props: { heading: string, values: Array<string> | string | undefined, italic?: boolean }) {
        if (!props.values) {
            return <></>;
        }
        let content;
        if (typeof props.values === "string") {
            content = props.values;
        } else {
            content = <>
                {
                    props.values.map((value, i) => <Box>{i + 1}. {value}</Box >)
                }
            </>
        }

        let sx = props.italic ? { fontStyle: 'italic' } : {}
        return <Box sx={{ mb: 2 }}>
            <>
                <Heading value={props.heading}></Heading>
                <Typography sx={sx}>
                    {content}
                </Typography>
            </>
        </Box>
    }

    function EintragCard(props: { eintrag: Eintrag }) {
        return <>
            <EintragRow heading={DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN} values={props.eintrag.dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin} />
            <EintragRow heading={DAS_NEHME_ICH_MIR_HEUTE_VOR} values={props.eintrag.dasNehmeIchMirHeuteVor} />
            <EintragRow heading={HEUTE_WIRD_GUT_WEIL} values={props.eintrag.heuteWirdGutWeil} />
            <EintragRow heading="" values={props.eintrag.spruch} italic />
            <EintragRow heading={EINE_POSITIVE_AFFIRMATION} values={props.eintrag.einePositiveAffirmation} />
            <EintragRow heading={DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG} values={props.eintrag.dieSchoenstenMomenteAmHeutigenTag} />
            <EintragRow heading={MORGEN_FREUE_ICH_MICH_AUF} values={props.eintrag.morgenFreueIchMichAuf} />
        </>
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
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <IconButton aria-label="share" sx={{ ml: 'auto' }}>
                    <Edit />
                </IconButton>
            </CardActions>
        </Card>
    );
}