import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Home from '@mui/icons-material/Home';
import CalendarToday from '@mui/icons-material/CalendarToday';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { isDate } from '../common/Helpers';
import { Settings } from '@mui/icons-material';

export default function BottomNav(props: { value: string, setValue: (value: string) => void }) {
    const [cookies] = useCookies(['fuenf_minuten_tagebuch_token'])
    const navigate = useNavigate();

    const handleChange = (event: React.SyntheticEvent | undefined, newValue: string) => {
        props.setValue(newValue);
        switch (newValue) {
            case "home": navigate("/"); break;
            case "today": navigate("/today"); break;
            case props.value: navigate(`/${props.value}`); break;
            case "favorites": navigate("/favorites"); break;
            case "settings": navigate("/settings"); break;
        }
    };

    const isValueDate = isDate(props.value);

    if (cookies.fuenf_minuten_tagebuch_token) {
        return <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation value={props.value} onChange={handleChange}>
                <BottomNavigationAction label="Home" value="home" icon={<Home />} />
                <BottomNavigationAction label={isValueDate ? props.value : "Today"} value={isValueDate ? props.value : "today"} icon={<CalendarToday />} />
                <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} disabled />
                <BottomNavigationAction label="Settings" value="settings" icon={<Settings />} />
            </BottomNavigation>
        </Paper>
    }
    return <></>
}