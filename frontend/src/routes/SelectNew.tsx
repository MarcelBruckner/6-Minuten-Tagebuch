import { DateCalendar } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { formatDate, formatWeek } from "../common/Helpers";
import WeekPicker from "../components/WeekPicker";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardActions, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SelectNew() {
    const [date, setDate] = useState<Moment>(moment(formatDate()));
    const [week, setWeek] = useState<Moment>(moment(formatDate()));
    const navigate = useNavigate();

    function onSelectDate() {
        navigate(`/daily/${formatDate(date)}`);
    }

    function onSelectWeek() {
        // navigate(`/weekly/${formatWeek(week)}`);
        alert('Noch nicht implementiert');
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    })

    return <Box textAlign='center' alignContent='center' sx={{ mb: 12 }}>
        <Card sx={{ mb: 2 }}>
            <CardHeader
                title={"Neuer täglicher Daily"}
            />
            <CardContent>
                <DateCalendar showDaysOutsideCurrentMonth defaultValue={date} onChange={(newValue) => setDate(newValue)} />
            </CardContent>
            <CardActions >
                <Button aria-label="ok" sx={{ m: 'auto' }} onClick={() => onSelectDate()} >
                    Ok
                </Button>
            </CardActions>
        </Card>
        <Card >
            <CardHeader
                title={"Neuer Wochenrückblick"}
            />
            <CardContent>
                <WeekPicker value={week} setValue={setWeek}></WeekPicker>
            </CardContent>
            <CardActions >
                <Button aria-label="ok" sx={{ m: 'auto' }} onClick={() => onSelectWeek()} >
                    Ok
                </Button>
            </CardActions>
        </Card>
    </Box >
}