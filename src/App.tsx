import { Box, ThemeProvider, CssBaseline } from "@mui/material"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/NavBar";
import dark from "./themes/dark";
import light from "./themes/light";
import Home from "./pages/Home";
import { useSettings } from "./contexts/SettingsContext";
import { ThemeSetting } from "./Settings";
import Tokens from "./pages/Tokens";
import RouterRedirect from "./components/RouterRedirect";
import Token from "./pages/Token";
import Address from "./pages/Address";

function App() {
    const { settings }  = useSettings()
    const theme = ({
        [ThemeSetting.Dark]: dark,
        [ThemeSetting.Light]: light
    })[settings.data.theme] || dark
    return <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
            minHeight: "var(--window-height)"
        }} bgcolor="background">
            <Toaster position="bottom-center" toastOptions={{
                duration: 5000,
                style: {
                    background: "#333",
                    color: "#fff",
                }
            }}/>
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/tokens" element={<Tokens />} />
                    <Route path="/token" element={<RouterRedirect to="/tokens" />} />

                    <Route path="/tokens/:id" element={<Token />} />
                    <Route path="/token/:id" element={<RouterRedirect to={({id}) => `/tokens/${id}`} />} />
                    
                    <Route path="/address/:address" element={<Address />} />
                </Routes>
            </BrowserRouter>
        </Box>
    </ThemeProvider>
}

export default App