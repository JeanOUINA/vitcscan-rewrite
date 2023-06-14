import { Box, ThemeProvider, CssBaseline } from "@mui/material"
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/NavBar";
import dark from "./themes/dark";
import Home from "./pages/Home";

function App() {
    return <ThemeProvider theme={dark}>
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
            <HashRouter>
                <NavBar/>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </HashRouter>
        </Box>
    </ThemeProvider>
}

export default App