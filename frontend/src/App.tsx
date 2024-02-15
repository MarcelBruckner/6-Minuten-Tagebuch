import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import Eintrag from './Eintrag';

export default function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container >
        <Eintrag />
      </Container>
    </React.Fragment>
  );
}