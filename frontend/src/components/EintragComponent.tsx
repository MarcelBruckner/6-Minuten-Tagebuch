import { useEffect, useState } from "react";
import IchBinDankbarFuer from "./MyMultipleLinesTextField";
import Spruch from "./Spruch";
import { EintragModel, EintragService } from "../client";
import moment from "moment";
import MyTextField from "./MyTextField";
import MyMultipleLinesTextField from "./MyMultipleLinesTextField";


export default function Eintrag() {
    const DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN = "3 große oder kleine Dinge, für die ich heute dankbar bin";
    const DAS_NEHME_ICH_MIR_HEUTE_VOR = "Das nehme ich mir heute vor";
    const HEUTE_WIRD_GUT_WEIL = "Heute wird gut weil ...";

    const EINE_POSITIVE_AFFIRMATION = "Eine positive Affirmation";
    const DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG = "Die schönsten Momente am heutigen Tag";

    const MORGEN_FREUE_ICH_MICH_AUF = "Morgen freue ich mich auf";

    const [eintrag, setEintrag] = useState<EintragModel>({
        datum: "1970-01-01", dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin: ["", "", ""], dasNehmeIchMirHeuteVor: "", heuteWirdGutWeil: "", einePositiveAffirmation: "", spruch: "", dieSchoenstenMomentaAmHeutigenTag: ["", "", ""], morgenFreueIchMichAuf: ""
    });

    useEffect(() => {
        async function getEintrag() {
            let formattedDate = (moment(new Date())).format('YYYY-MM-DD')
            setEintrag(await EintragService.eintragGetEintrag({ datum: formattedDate }));
        };
        getEintrag();
    }, []);

    async function onMyMultipleLinesTextFieldUpdated(title: string, row: number, value: string) {
        if (title == DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN) {
            eintrag.dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin[row] = value;
        } else if (title == DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG) {
            eintrag.dieSchoenstenMomentaAmHeutigenTag[row] = value;
        } else {
            throw new Error("Unknown MyTextField updated: " + title)
        }

        setEintrag(eintrag);
        await EintragService.eintragPostEintrag({ requestBody: eintrag });
    }

    async function onMyTextFieldUpdated(title: string, value: string) {
        if (title === DAS_NEHME_ICH_MIR_HEUTE_VOR) {
            eintrag.dasNehmeIchMirHeuteVor = value;
        } else if (title === HEUTE_WIRD_GUT_WEIL) {
            eintrag.heuteWirdGutWeil = value;
        } else if (title === EINE_POSITIVE_AFFIRMATION) {
            eintrag.einePositiveAffirmation = value;
        } else if (title === MORGEN_FREUE_ICH_MICH_AUF) {
            eintrag.morgenFreueIchMichAuf = value;
        } else {
            throw new Error("Unknown MyTextField updated: " + title)
        }

        setEintrag(eintrag);
        await EintragService.eintragPostEintrag({ requestBody: eintrag });
    }


    return <>
        <MyMultipleLinesTextField values={eintrag.dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin} onUpdated={onMyMultipleLinesTextFieldUpdated} title={DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN} helperText={DREI_GROSSE_ODER_KLEINE_DINGE_FUER_DIE_ICH_HEUTE_DANKBAR_BIN} />
        <MyTextField value={eintrag.dasNehmeIchMirHeuteVor} onUpdated={onMyTextFieldUpdated} title={DAS_NEHME_ICH_MIR_HEUTE_VOR} helperText={DAS_NEHME_ICH_MIR_HEUTE_VOR} />
        <MyTextField value={eintrag.heuteWirdGutWeil} onUpdated={onMyTextFieldUpdated} title={HEUTE_WIRD_GUT_WEIL} helperText={HEUTE_WIRD_GUT_WEIL} />

        <Spruch value={eintrag.spruch} />

        <MyTextField value={eintrag.einePositiveAffirmation} onUpdated={onMyTextFieldUpdated} title={EINE_POSITIVE_AFFIRMATION} helperText={EINE_POSITIVE_AFFIRMATION} />
        <MyMultipleLinesTextField values={eintrag.dieSchoenstenMomentaAmHeutigenTag} onUpdated={onMyMultipleLinesTextFieldUpdated} title={DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG} helperText={DIE_SCHOENSTEN_MOMENTE_AM_HEUTIGEN_TAG} />
        <MyTextField value={eintrag.morgenFreueIchMichAuf} onUpdated={onMyTextFieldUpdated} title={MORGEN_FREUE_ICH_MICH_AUF} helperText={MORGEN_FREUE_ICH_MICH_AUF} />
    </>
}