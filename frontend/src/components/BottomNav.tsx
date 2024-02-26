import { BottomNavigation, BottomNavigationAction, Paper, styled } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { formatDate, isDate, parseDate } from '../common/Helpers';
import { Add, Home, Settings } from '@mui/icons-material';
import Fab from '@mui/material/Fab';
import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DateCalendar } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';
import WeekPicker from './WeekPicker';

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
});

export default function BottomNav() {
    const [cookies] = useCookies(['sechs_minuten_tagebuch_token'])
    const [isDialogOpen, setDialogOpen] = React.useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname.substring(1);

    const handleChange = (_event: React.SyntheticEvent | undefined, newValue: string) => {
        if (newValue === 'new') {
            setDialogOpen(true);
            return;
        }
        navigate(`/${newValue}`);
    };

    function CreateDialog() {
        const [date, setDate] = React.useState<Moment>(moment(formatDate()));

        const handleClose = () => {
            setDialogOpen(false);
            navigate(`/daily/${formatDate(date)}`);
        };

        return <Dialog open={isDialogOpen} fullScreen>
            <DialogTitle>Neuer Eintrag</DialogTitle>
            <DialogContent>
                {!isDate(pathname) &&
                    <DateCalendar showDaysOutsideCurrentMonth defaultValue={moment(isDate(pathname) ? parseDate(pathname) : formatDate())} onChange={(newValue) => setDate(newValue)} />
                }
                <WeekPicker></WeekPicker>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleClose}>Ok</Button>
            </DialogActions>
        </Dialog >
    }

    if (cookies.sechs_minuten_tagebuch_token) {
        return <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation value={pathname} onChange={handleChange}>
                <BottomNavigationAction label="Home" value="" icon={<Home />} />
                {!isDate(pathname) && <BottomNavigationAction label="" value="new" icon={<StyledFab aria-label="add"><Add /></StyledFab>} />}
                <BottomNavigationAction label="Settings" value="settings" icon={<Settings />} />
            </BottomNavigation>
            <CreateDialog />
        </Paper>
    }
    return <></>
}