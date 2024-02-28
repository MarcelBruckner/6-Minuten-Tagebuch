import { TextField } from "@mui/material";
import { v4 } from "uuid";
import { VARIANT } from "../strings/Constants";

export default function MyMultipleLinesTextField(props: { title: string, helperText: string, values: Array<string> | undefined, onUpdated: (title: string, row: number, value: string) => void }) {

    function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) {
        const row: number = parseInt(event!.target.id);
        const value = event!.target.value;
        props.onUpdated(props.title, row, value);
    }
    if (!props.values) {
        props.values = new Array(3)
    }

    let values = props.values.map(item => {
        return { uid: v4(), value: item };
    });

    return <>
        {values.map((x, i) =>
            <TextField
                id={i + ""}
                className="textfield"
                label={(i + 1) + "."}
                key={x.uid}
                defaultValue={x.value}
                variant={VARIANT}
                helperText={props.helperText}
                onChange={onChange} />
        )
        }
    </>
}