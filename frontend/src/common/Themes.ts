import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
// When using TypeScript 4.x and above
import type {} from "@mui/x-date-pickers/themeAugmentation";

export const DARK_THEME = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: grey[100],
    },
  },
});

export const LIGHT_THEME = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: grey[900],
    },
  },
});
