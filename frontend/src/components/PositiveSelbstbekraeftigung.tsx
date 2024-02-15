import { TextField } from "@mui/material";
import { VARIANT } from "./constants";


export class PositiveSelbstbekraeftigungValues {
    constructor(public entry: string) { }
}

export default function PositiveSelbstbekraeftigung(props: { values: PositiveSelbstbekraeftigungValues, onUpdated: (values: PositiveSelbstbekraeftigungValues) => void }) {

    function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) {
        const value = event!.target.value;

        props.values.entry = value;
        console.log(props.values);
        props.onUpdated(props.values);
    }

    return <>
        <h1>Positive Selbstbekräftigung</h1>
        <TextField
            multiline
            className="textfield"
            defaultValue={props.values.entry}
            variant={VARIANT}
            helperText="Ein paar positive Worte die mich selbst bekräftigen!"
            onChange={onChange} />
    </>
}