import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, ThemeProvider } from '@mui/material';
import { OpenAPI } from './client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './routes/Home';
import { LIGHT_THEME } from './common/Themes';
import SignIn from './routes/SignIn';
import BottomNav from './components/BottomNav';
import EintragDetail from './routes/Eintrag';
import { useEffect, useState } from 'react';
import Settings from './routes/Settings';
import { useCookies } from 'react-cookie';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

export default function App() {
  const [bottomNavValue, setBottomNavValue] = useState('home');
  const [cookies] = useCookies(['sechs_minuten_tagebuch_backend_url'])
  OpenAPI.BASE = cookies.sechs_minuten_tagebuch_backend_url;
  useEffect(() => {
    document.title = '6-Minuten Tagebuch';
  }, []);
  return (
    <BrowserRouter>
      <ThemeProvider theme={LIGHT_THEME}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <CssBaseline />
          <Container component="main" maxWidth="md">
            <Routes>
              <Route path="/" element={<Home />} /> :
              <Route path="/signin" element={<SignIn signin={true} onSignIn={() => setBottomNavValue('home')} />} />
              <Route path="/signup" element={<SignIn signin={false} onSignIn={() => setBottomNavValue('home')} />} />
              <Route path="/settings" element={<Settings onEditSettings={() => setBottomNavValue('settings')} />} />
              <Route path="/:date" element={<EintragDetail onChangeDate={setBottomNavValue} onDeleteEintrag={() => setBottomNavValue('home')} />} />
            </Routes>
          </Container>
          <BottomNav value={bottomNavValue} setValue={setBottomNavValue} />
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}