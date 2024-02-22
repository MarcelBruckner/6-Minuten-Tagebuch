import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, ThemeProvider } from '@mui/material';
import { OpenAPI } from './client';
import Environment from './common/Environment';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import About from './routes/About';
import { LIGHT_THEME } from './common/Themes';
import SignIn from './routes/SignIn';
import BottomNav from './components/BottomNav';
import EintragDetail from './routes/Eintrag';

OpenAPI.BASE = Environment.getBackendUrl();


export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={LIGHT_THEME}>
        <CssBaseline />
        <Container component="main" maxWidth="md">
          <Routes>
            <Route path="/" element={<Home />} /> :
            <Route path="/signin" element={<SignIn signin={true} />} />
            <Route path="/signup" element={<SignIn signin={false} />} />
            <Route path="/about" element={<About />} />
            <Route path="/today" element={<EintragDetail date={new Date()} />} />
          </Routes>
        </Container>
        <BottomNav />
      </ThemeProvider>
    </BrowserRouter>
  );
}