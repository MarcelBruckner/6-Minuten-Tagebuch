import { DateCalendar } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { formatDate, formatWeek } from "../common/Helpers";
import WeekPicker from "../components/WeekPicker";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardActions, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SelectNew() {
    const [date] = useState<Moment>(moment(formatDate()));
    const [week] = useState<Moment>(moment(formatDate()));
    const navigate = useNavigate();

    function onSelectDate(newValue: Moment) {
        navigate(`/daily/${formatDate(newValue)}`);
    }

    function onSelectWeek(newValue: Moment) {
        navigate(`/weekly/${formatWeek(newValue)}`);
    }

    return <Box textAlign='center' alignContent='center' sx={{ mb: 12 }}>
        <Card sx={{ mb: 2 }}>
            <CardHeader
                title={"Neuer täglicher Eintrag"}
            />
            <CardContent>
                <DateCalendar showDaysOutsideCurrentMonth defaultValue={date} onChange={onSelectDate} />
            </CardContent>
        </Card>
        <Card >
            <CardHeader
                title={"Neuer Wochenrückblick"}
            />
            <CardContent>
                <WeekPicker value={week} setValue={onSelectWeek}></WeekPicker>
            </CardContent>
        </Card>
    </Box >
}