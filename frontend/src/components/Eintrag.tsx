import { useState } from "react";
import IchBinDankbarFuer, { IchBinDankbarFuerValues } from "./IchBinDankbarFuer";
import SoSorgeIchFuerEinenGutenTag, { SoSorgeIchFuerEinenGutenTagValues } from "./SoSorgeIchFuerEinenGutenTag";
import PositiveSelbstbekraeftigung, { PositiveSelbstbekraeftigungValues } from "./PositiveSelbstbekraeftigung";
import Spruch from "./Spruch";

export default function Eintrag() {
    const [ichBinDankbarFuerValues, setIchBinDankbarFuerValues] = useState<IchBinDankbarFuerValues>(new IchBinDankbarFuerValues(["", "", ""]));
    const [soSorgeIchFuerEinenGutenTagValues, setSoSorgeIchFuerEinenGutenTagValues] = useState<SoSorgeIchFuerEinenGutenTagValues>(new SoSorgeIchFuerEinenGutenTagValues(""));
    const [positiveSelbstbekraeftigungValues, setPositiveSelbstbekraeftigungValues] = useState<PositiveSelbstbekraeftigungValues>(new PositiveSelbstbekraeftigungValues(""));

    return <>
        <IchBinDankbarFuer values={ichBinDankbarFuerValues} onUpdated={setIchBinDankbarFuerValues} />
        <SoSorgeIchFuerEinenGutenTag values={soSorgeIchFuerEinenGutenTagValues} onUpdated={setSoSorgeIchFuerEinenGutenTagValues} />
        <PositiveSelbstbekraeftigung values={positiveSelbstbekraeftigungValues} onUpdated={setPositiveSelbstbekraeftigungValues} />

        <Spruch />
    </>
}