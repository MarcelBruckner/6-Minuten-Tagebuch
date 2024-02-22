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
import NavBar from './components/NavBar';
import { LIGHT_THEME } from './common/Themes';
import SignIn from './routes/SignIn';

OpenAPI.BASE = Environment.getBackendUrl();


export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={LIGHT_THEME}>
        <CssBaseline />
        <NavBar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} /> :
            <Route path="/signin" element={<SignIn signin={true} />} />
            <Route path="/signup" element={<SignIn signin={false} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </BrowserRouter>
  );
}