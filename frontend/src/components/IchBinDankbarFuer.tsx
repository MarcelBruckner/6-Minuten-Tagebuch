import { TextField } from "@mui/material";
import { useState } from "react";
import { VARIANT } from "./constants";


type Entries = [string, string, string]

export class IchBinDankbarFuerValues {
    constructor(public entries: Entries) { }
}

export default function IchBinDankbarFuer(props: { values: IchBinDankbarFuerValues, onUpdated: (values: IchBinDankbarFuerValues) => void }) {

    function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) {
        const row: number = +(event!.target.id);
        const value = event!.target.value;

        props.values.entries[row] = value;
        console.log(props.values);
        props.onUpdated(props.values);
    }

    return <>
        <h1>Ich bin dankbar für</h1>
        {[...Array(3)].map((x, i) =>
            <div>
                <TextField
                    id={i + ""}
                    className="textfield"
                    label={(i + 1) + "."}
                    defaultValue={props.values.entries[i]}
                    variant={VARIANT}
                    helperText={"Wofür bin ich heute früh dankbar?"}
                    onChange={onChange} />
            </div>
        )
        }
    </>
}