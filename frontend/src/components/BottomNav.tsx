import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Home from '@mui/icons-material/Home';
import CalendarToday from '@mui/icons-material/CalendarToday';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { formatDate, isDate } from '../common/Helpers';
import { Settings } from '@mui/icons-material';

export default function BottomNav() {
    const [cookies] = useCookies(['sechs_minuten_tagebuch_token'])
    const navigate = useNavigate();
    const location = useLocation();

    const pathname = location.pathname.substring(1);

    const handleChange = (event: React.SyntheticEvent | undefined, newValue: string) => {
        navigate(`/${newValue}`);
    };

    const isValueDate = isDate(pathname);

    if (cookies.sechs_minuten_tagebuch_token) {
        return <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation value={pathname} onChange={handleChange}>
                <BottomNavigationAction label="Home" value="" icon={<Home />} />
                <BottomNavigationAction label={isValueDate ? pathname : formatDate()} value={isValueDate ? pathname : formatDate()} icon={<CalendarToday />} />
                <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} disabled />
                <BottomNavigationAction label="Settings" value="settings" icon={<Settings />} />
            </BottomNavigation>
        </Paper>
    }
    return <></>
}