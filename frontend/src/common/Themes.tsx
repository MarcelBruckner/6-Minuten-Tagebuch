import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

export const DARK_THEME = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: grey[100],
        },
    },
});

export const LIGHT_THEME = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: grey[900],
        },
    },
});
