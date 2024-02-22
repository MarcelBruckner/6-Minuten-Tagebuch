import * as React from 'react';
import TextField from '@mui/material/TextField';
import Copyright from '../components/Copyright';
import { useCookies } from 'react-cookie'
import { Box, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { OpenAPI } from '../client';


export default function Settings(props: { onEditSettings: () => void }) {
    const [cookies, setCookie, removeCookie] = useCookies(['fuenf_minuten_tagebuch_token', 'fuenf_minuten_tagebuch_backend_url'])
    const navigate = useNavigate();
    props.onEditSettings();

    React.useEffect(() => {
        if (!cookies.fuenf_minuten_tagebuch_token) {
            navigate("/signin");
            return;
        }
        OpenAPI.TOKEN = cookies.fuenf_minuten_tagebuch_token;
    }, [cookies, navigate])

    function onChangeBackendUrl(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) {
        const value = event!.target.value;
        setCookie('fuenf_minuten_tagebuch_backend_url', value, { expires: new Date(2090, 1, 1) });
    }

    function onLogout() {
        removeCookie('fuenf_minuten_tagebuch_token');
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
            value={cookies.fuenf_minuten_tagebuch_backend_url}
            onChange={onChangeBackendUrl}
        />

        <IconButton sx={{ mt: 10 }} onClick={onLogout}>
            <Logout></Logout>
        </IconButton>

        <Copyright sx={{ mt: 8, mb: 4 }} />
    </Box>
        ;
}
