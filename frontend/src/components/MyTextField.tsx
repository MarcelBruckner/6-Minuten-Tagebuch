import { TextField } from "@mui/material";
import { useState } from "react";
import { VARIANT } from "./constants";


export default function MyTextField(props: { title: string, helperText: string, value: string | undefined, onUpdated: (title: string, value: string) => void }) {

    function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) {
        const value = event!.target.value;
        props.onUpdated(props.title, value);
    }

    return <>
        <h2>{props.title}</h2>
        <TextField
            multiline
            className="textfield"
            defaultValue={props.value}
            variant={VARIANT}
            helperText={props.helperText}
            onChange={onChange} />
    </>
}