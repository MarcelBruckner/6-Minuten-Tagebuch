import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Copyright from '../components/Copyright';
import { ApiError, AuthService, Body_auth_login_for_access_token, OpenAPI, UserIn, UserService } from '../client';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'
import { jwtDecode } from "jwt-decode";
import { AxiosError } from 'axios';

const USERNAME_ERROR = "Username not set!";
const EMAIL_ERROR = "EMail not set!";
const PASSWORD_ERROR = "Pasword not set!";

export default function SignIn(props: { signin: boolean, onSignIn: () => void }) {
    const navigate = useNavigate();

    const [authBody, setAuthBody] = React.useState<Body_auth_login_for_access_token>({ username: "", password: "" })
    const [userIn, setUserIn] = React.useState<UserIn>({ email: "", password: "", username: "" })
    const [formErrors, setFormErrors] = React.useState<Array<string>>([])
    const [validationErrors, setValidationErrors] = React.useState<Array<string>>([])
    const [cookies, setCookie] = useCookies(['fuenf_minuten_tagebuch_token', 'fuenf_minuten_tagebuch_backend_url'])

    const passwordError = React.useMemo<boolean>(() => formErrors.includes(PASSWORD_ERROR), [formErrors])
    const emailError = React.useMemo<boolean>(() => formErrors.includes(EMAIL_ERROR), [formErrors])
    const usernameError = React.useMemo<boolean>(() => formErrors.includes(USERNAME_ERROR), [formErrors])

    React.useEffect(() => {
        if (cookies.fuenf_minuten_tagebuch_token) {
            props.onSignIn();
            navigate('/');
        }
    }, [cookies, navigate])

    function onChangeBackendUrl(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) {
        const value = event!.target.value;
        setCookie('fuenf_minuten_tagebuch_backend_url', value, { expires: new Date(2090, 1, 1) });
    }

    async function onSignUp(data: FormData): Promise<boolean> {
        const password = data.get('password')?.toString();
        const username = data.get('username')?.toString();
        const email = data.get('email')?.toString();
        let full_name = data.get('fullName')?.toString();

        const availableErrors = [];
        username || availableErrors.push(USERNAME_ERROR);
        email || availableErrors.push(EMAIL_ERROR);
        password || availableErrors.push(PASSWORD_ERROR);
        setFormErrors(availableErrors);

        if (!full_name) {
            full_name = username;
        }

        if (!username || !password || !email) {
            return false;
        }

        userIn.username = username;
        userIn.password = password;
        userIn.full_name = full_name;
        userIn.email = email;
        setUserIn(userIn);

        try {
            await UserService.userCreateUser({ requestBody: userIn });
        } catch (e) {
            const validationErrors: Array<string> = [];
            const api_error = e as ApiError;
            if (api_error.status === 422) {
                for (const detail of api_error.body.detail) {
                    validationErrors.push(detail.ctx.reason);
                    if (detail.loc.includes("email")) {
                        availableErrors.push(EMAIL_ERROR);
                    }
                }
            } else if (api_error.status === 409) {
                validationErrors.push(api_error.body.message);
            }
            setValidationErrors(validationErrors);
            return false;
        }

        setFormErrors([]);
        setValidationErrors([]);
        return true;
    }
    async function onSignIn(data: FormData): Promise<boolean> {
        const password = data.get('password')?.toString();
        const username = data.get('username')?.toString();
        const remember = data.get('remember');


        const availableErrors = [];
        username || availableErrors.push(USERNAME_ERROR);
        password || availableErrors.push(PASSWORD_ERROR);
        setFormErrors(availableErrors);

        if (!username || !password) {
            return false;
        }

        authBody.password = password;
        authBody.username = username;
        setAuthBody(authBody);

        try {
            const response = await AuthService.authLoginForAccessToken({ formData: authBody });

            if (remember) {
                const token = jwtDecode(response.access_token) as { sub: string, exp: number };
                const expires = new Date(token.exp * 1000);
                setCookie('fuenf_minuten_tagebuch_token', response.access_token, { expires: expires })
                // setCookie('fuenf_minuten_tagebuch_token', response.access_token, { secure: true, sameSite: 'none', expires: expires })
            } else {
                setCookie('fuenf_minuten_tagebuch_token', response.access_token, {})
                // setCookie('fuenf_minuten_tagebuch_token', response.access_token, { secure: true, sameSite: 'none' })
            }
            console.log(response.access_token);
            OpenAPI.TOKEN = response.access_token;
            return true;
        } catch (e) {
            if (e instanceof AxiosError) {
                setValidationErrors([e.message]);
            } else if (e instanceof ApiError) {
                setValidationErrors([e.body.detail])
            }
            return false;
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (props.signin) {
            const result = await onSignIn(data);
            if (!result) {
                return;
            }
            props.onSignIn();
            navigate("/");
        } else {
            const result = await onSignUp(data);
            if (!result) {
                return;
            }
            navigate("/signin");
        }
    };

    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h3" sx={{ mb: 5 }}>
                    5-Minuten Tagebuch
                </Typography>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {props.signin ? "Sign In" : "Sign Up"}
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        error={usernameError}
                    />
                    {!props.signin &&
                        <>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="full_name"
                                label="Full Name"
                                name="full_name"
                                autoComplete="full_name"
                                autoFocus
                            /><TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="EMail"
                                name="email"
                                autoComplete="email"
                                type='email'
                                autoFocus
                                error={emailError}
                            />
                        </>
                    }
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        error={passwordError}
                    />

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
                    {props.signin &&
                        < FormControlLabel
                            control={<Checkbox value={true} color="primary" />}
                            label="Remember me"
                            id='remember'
                            name='remember'
                        />
                    }
                    {
                        validationErrors.map((x) => <Alert severity="error">{x}</Alert>)
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {props.signin ? "Sign In" : "Sign Up"}
                    </Button>

                    <Grid container>
                        <Grid item xs>
                            {props.signin &&
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            }
                        </Grid>
                        <Grid item>
                            <Link href={props.signin ? "/signup" : "/signin"} variant="body2">
                                {props.signin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </>
    );
}
