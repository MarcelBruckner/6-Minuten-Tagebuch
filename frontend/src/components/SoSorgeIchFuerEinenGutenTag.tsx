import { TextField } from "@mui/material";
import { useState } from "react";
import { VARIANT } from "./constants";


export class SoSorgeIchFuerEinenGutenTagValues {
    constructor(public entry: string) { }
}

export default function IchBinDankbarFuer(props: { values: SoSorgeIchFuerEinenGutenTagValues, onUpdated: (values: SoSorgeIchFuerEinenGutenTagValues) => void }) {

    function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) {
        const value = event!.target.value;

        props.values.entry = value;
        console.log(props.values);
        props.onUpdated(props.values);
    }

    return <>
        <h1>So sorge ich für einen guten Tag...</h1>
        <TextField
            multiline
            className="textfield"
            defaultValue={props.values.entry}
            variant={VARIANT}
            helperText="Wie sorge ich heute für einen guten Tag?"
            onChange={onChange} />
    </>
}