import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import { OpenAPI, User, UserService } from '../client';
import { useNavigate } from 'react-router-dom';

export default function ButtonAppBar() {
    const [cookies, setCookie, removeCookie] = useCookies(['token'])
    const navigate = useNavigate();

    function signOut() {
        removeCookie('token');
        navigate('/');
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" id="navbar">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Button href="/" color="inherit">6-Minuten Tagebuch</Button>
                    </Typography>
                    {cookies.token ?
                        <Button color="inherit" onClick={signOut}>Sign Out</Button>
                        :
                        <Button href="/signin" color="inherit">Sign In</Button>
                    }
                    <Button href="/about" color="inherit">about</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}