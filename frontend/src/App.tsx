import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, ThemeProvider } from '@mui/material';
import { OpenAPI } from './client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import SignIn from './routes/SignIn';
import BottomNav from './components/BottomNav';
import EintragDetail from './routes/Eintrag';
import { useEffect, useState } from 'react';
import Settings from './routes/Settings';
import { useCookies } from 'react-cookie';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DARK_THEME, LIGHT_THEME } from './common/Themes';
import 'moment/locale/de';


export default function App() {
  const [cookies] = useCookies(['sechs_minuten_tagebuch_backend_url', 'sechs_minuten_tagebuch_dark_theme'])
  const [darkTheme, setDarkTheme] = useState<boolean>(cookies.sechs_minuten_tagebuch_dark_theme);

  OpenAPI.BASE = cookies.sechs_minuten_tagebuch_backend_url;
  useEffect(() => {
    document.title = '6-Minuten Tagebuch';
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={darkTheme ? DARK_THEME : LIGHT_THEME}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="de" >
          <CssBaseline />
          <Container component="main" maxWidth="md">
            <Routes>
              <Route path="/" element={<Home />} /> :
              <Route path="/signin" element={<SignIn signin={true} />} />
              <Route path="/signup" element={<SignIn signin={false} />} />
              <Route path="/settings" element={<Settings darkTheme={darkTheme} setDarkTheme={setDarkTheme} />} />
              <Route path="/daily/:date" element={<EintragDetail />} />
            </Routes>
          </Container>
          <BottomNav />
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}