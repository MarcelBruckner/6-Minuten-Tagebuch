import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Home from '@mui/icons-material/Home';
import CalendarToday from '@mui/icons-material/CalendarToday';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function BottomNav() {
    const [cookies] = useCookies(['token'])
    const [value, setValue] = useState('home');
    const navigate = useNavigate();

    const handleChange = (event: React.SyntheticEvent | undefined, newValue: string) => {
        setValue(newValue);
        switch (newValue) {
            case "home": navigate("/"); break;
            case "today": navigate("/today"); break;
            case "favorites": navigate("/favorites"); break;
        }
    };

    if (cookies.token) {
        return <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation value={value} onChange={handleChange}>
                <BottomNavigationAction label="Home" value="home" icon={<Home />} />
                <BottomNavigationAction label="Today" value="today" icon={<CalendarToday />} />
                <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} />
            </BottomNavigation>
        </Paper>
    }
    return <></>
}