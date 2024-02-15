import { useState } from "react";
import IchBinDankbarFuer, { IchBinDankbarFuerValues } from "./components/IchBinDankbarFuer";
import SoSorgeIchFuerEinenGutenTag, { SoSorgeIchFuerEinenGutenTagValues } from "./components/SoSorgeIchFuerEinenGutenTag";
import PositiveSelbstbekraeftigung, { PositiveSelbstbekraeftigungValues } from "./components/PositiveSelbstbekraeftigung";
import Spruch from "./components/Spruch";

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