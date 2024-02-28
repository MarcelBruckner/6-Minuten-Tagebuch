import { BottomNavigation, BottomNavigationAction, Paper, styled } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Add, Home, Settings } from '@mui/icons-material';
import Fab from '@mui/material/Fab';
import React from 'react';


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

    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname.substring(1);

    const handleChange = (_event: React.SyntheticEvent | undefined, newValue: string) => {
        navigate(`/${newValue}`);
    };

    if (cookies.sechs_minuten_tagebuch_token) {
        return <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation value={pathname} onChange={handleChange}>
                <BottomNavigationAction label="Home" value="" icon={<Home />} />
                <BottomNavigationAction label="" value="--this-is-a-dummy-value" disabled />
                <BottomNavigationAction label="Settings" value="settings" icon={<Settings />} />
            </BottomNavigation>
            <StyledFab aria-label="add" onClick={() => handleChange(undefined, 'new')}><Add /></StyledFab>
        </Paper>
    }
    return <></>
}