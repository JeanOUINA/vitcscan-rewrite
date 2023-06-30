import { AppBar, Box, Button, IconButton, Link, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";
import { Search, Settings } from "@mui/icons-material";
import Modal from "./Modal";
import SettingsModal from "../modals/SettingsModal";
import { useSettings } from "../contexts/SettingsContext";
import { ThemeSetting } from "../Settings";
import darkTheme from "../themes/dark";
import lightTheme from "../themes/light";
import SearchField from "./SearchField";
import SearchModal from "../modals/SearchModal";

export default function NavBar() {
    const [ navBarHeight, setNavBarHeight ] = useState(0)
    const [ appHeight, setAppHeight ] = useState(window.innerHeight)
    const isMobile = useIsMobile()
    const [ searchOpen, setSearchOpen ] = useState(false)
    const [ settingsOpen, setSettingsOpen ] = useState(false)
    const { settings } = useSettings()
    
    useEffect(() => {
        const appHeight = () => {
            setAppHeight(window.innerHeight)
        }
        window.addEventListener("resize", appHeight)
        appHeight()
        return () => {
            window.removeEventListener("resize", appHeight)
        }
    }, [])

    useEffect(() => {
        document.documentElement.style.setProperty("--app-height", `${appHeight - navBarHeight}px`)
    }, [appHeight, navBarHeight])

    return <AppBar position="sticky" ref={(appBar) => {
        setNavBarHeight(appBar?.clientHeight ?? 0)
    }} sx={{
        background: settings.data.theme === ThemeSetting.Dark ?
            darkTheme.palette.background.default :
            lightTheme.palette.background.default,
    }}>
        <Toolbar sx={{
            gap: 1,
            alignItems: "center"
        }}>
            <Link component={RouterLink} to="/">
                <Button>
                    <img src={"/favicon.png"} draggable={false} style={{
                        height: 48,
                    }}/>
                    {!isMobile && <Typography variant="h4" sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        fontFamily: "poppins-semibold, poppins, sans-serif"
                    }}>
                        VITCScan
                    </Typography>}
                </Button>
            </Link>

            {
                isMobile ? <>
                    <Box sx={{
                        flexGrow: 1
                    }} />

                    <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => {
                        setSearchOpen(true)
                    }}>
                        <Search />
                    </IconButton>
                </>  : <>
                    <SearchField sx={{
                        flexGrow: 1
                    }} />
                </>
            }

            <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => {
                setSettingsOpen(true)
            }}>
                <Settings />
            </IconButton>
        </Toolbar>
        <Toolbar sx={{
            gap: 1,
            alignItems: "center",
            display: !isMobile ? "flex" : "none"
        }}>
            <Link component={RouterLink} to="/sbps">
                <Button>
                    SBPs
                </Button>
            </Link>
            
            <Link component={RouterLink} to="/tokens">
                <Button>
                    Tokens
                </Button>
            </Link>
            
            <Link component={RouterLink} to="/snapshots">
                <Button>
                    Blocks
                </Button>
            </Link>
        </Toolbar>

        <Modal open={searchOpen && isMobile} onClose={() => {
            setSearchOpen(false)
        }}>
            <SearchModal close={() => setSearchOpen(false)} />
        </Modal>
        <Modal open={settingsOpen} onClose={() => {
            setSettingsOpen(false)
        }}>
            <SettingsModal close={() => setSettingsOpen(false)} />
        </Modal>
    </AppBar>
}