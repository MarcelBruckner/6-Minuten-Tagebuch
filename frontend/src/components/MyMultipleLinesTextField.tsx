import { TextField } from "@mui/material";
import { VARIANT } from "./constants";
import { v4 } from "uuid";

export default function MyMultipleLinesTextField(props: { title: string, helperText: string, values: Array<string>, onUpdated: (title: string, row: number, value: string) => void }) {

    function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) {
        const row: number = parseInt(event!.target.id);
        const value = event!.target.value;
        props.onUpdated(props.title, row, value);
    }

    let values = props.values.map(item => {
        return { uid: v4(), value: item };
    });

    return <>
        <h2>{props.title}</h2>
        {values.map((x, i) =>
            <div>
                <TextField
                    className="textfield"
                    label={(i + 1) + "."}
                    key={x.uid}
                    defaultValue={x.value}
                    variant={VARIANT}
                    helperText={props.helperText}
                    onChange={onChange} />
            </div>
        )
        }
    </>
}