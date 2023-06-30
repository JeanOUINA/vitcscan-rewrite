import {
    createTheme,
    responsiveFontSizes
} from "@mui/material/styles";

const darkTheme = responsiveFontSizes(createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#FF6729"
        },
        secondary: {
            main: "#2A2A2A"
        },
        background: {
            default: "#1A1A1A"
        }
    }
}))

export default darkTheme