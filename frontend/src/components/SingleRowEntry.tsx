import { Card, CardHeader, CardContent, TextField } from "@mui/material";
import { VARIANT } from "../strings/Constants";

export default function SingleRowEntry(props: { title: string, value: string | undefined, helperText: string, multiline?: boolean, onChange: (title: string, value: string) => void }) {
    return <Card sx={{ mb: 2 }} key={props.value}>
        <CardHeader title={props.title} sx={{ textTransform: 'uppercase' }} />
        <CardContent>
            <TextField
                multiline={props.multiline}
                className="textfield"
                defaultValue={props.value!}
                variant={VARIANT}
                helperText={props.helperText}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => props.onChange(props.title, e!.target.value)}
                title={props.title} />
        </CardContent>
    </Card>
}