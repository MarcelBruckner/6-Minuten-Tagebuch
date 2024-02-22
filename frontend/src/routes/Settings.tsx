import * as React from 'react';
import TextField from '@mui/material/TextField';
import Copyright from '../components/Copyright';
import { useCookies } from 'react-cookie'
import { Box, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { OpenAPI } from '../client';


export default function Settings(props: { onEditSettings: () => void }) {
    const [cookies, setCookie, removeCookie] = useCookies(['sechs_minute_tagebuch_token', 'sechs_minuten_tagebuch_backend_url'])
    const navigate = useNavigate();
    props.onEditSettings();

    React.useEffect(() => {
        if (!cookies.sechs_minute_tagebuch_token) {
            navigate("/signin");
            return;
        }
        OpenAPI.TOKEN = cookies.sechs_minute_tagebuch_token;
    }, [cookies, navigate])

    function onChangeBackendUrl(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) {
        const value = event!.target.value;
        setCookie('sechs_minuten_tagebuch_backend_url', value, { expires: new Date(2090, 1, 1) });
    }

    function onLogout() {
        removeCookie('sechs_minute_tagebuch_token');
    }

    return <Box sx={{ mt: 10 }} textAlign='center'>
        <TextField
            margin="normal"
            required
            fullWidth
            id="url"
            label="Backend URL"
            name="url"
            autoComplete="url"
            autoFocus
            value={cookies.sechs_minuten_tagebuch_backend_url}
            onChange={onChangeBackendUrl}
        />

        <IconButton sx={{ mt: 10 }} onClick={onLogout}>
            <Logout></Logout>
        </IconButton>

        <Copyright sx={{ mt: 8, mb: 4 }} />
    </Box>
        ;
}
