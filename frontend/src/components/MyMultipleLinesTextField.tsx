import { TextField } from "@mui/material";
import { VARIANT } from "../strings/constants";
import { v4 } from "uuid";

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
            <div>
                <TextField
                    id={i + ""}
                    className="textfield"
                    label={(i + 1) + "."}
                    key={x.value}
                    defaultValue={x.value}
                    variant={VARIANT}
                    helperText={props.helperText}
                    onChange={onChange} />
            </div>
        )
        }
    </>
}