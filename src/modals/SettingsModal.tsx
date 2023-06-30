import { Alert, Box, Divider, IconButton, Link, MenuItem, Select, Switch, Typography } from "@mui/material"
import { DataEncoding, ThemeSetting } from "../Settings"
import { useSettings } from "../contexts/SettingsContext"
import { Close, Info } from "@mui/icons-material"
import Modal from "../components/Modal"
import HideScamTokensInfoModal from "./HideScamTokensInfoModal"
import { useState } from "react"
import OutlinedPaper from "../components/OutlinedPaper"

export default function SettingsModal({
    close
}:{
    close: () => void
}){
    const { settings } = useSettings()
    const [ hideScamTokensInfoModalOpen, setHideScamTokensInfoModalOpen ] = useState(false)

    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,

        "& > *": {
            width: 1
        }
    }}>
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <Typography variant="h4" fontWeight="bold">
                Settings
            </Typography>

            <IconButton onClick={close}>
                <Close />
            </IconButton>
        </Box>
        <Divider />

        <Typography variant="h6" fontWeight="bold" sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            alignItems: "center",
            gap: 1
        }}>
            Hide Scam Tokens <Info sx={{
                cursor: "pointer"
            }} onClick={() => setHideScamTokensInfoModalOpen(true)} />
        </Typography>
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <Typography variant="body1">
                Hide tokens that have been marked as scams.
            </Typography>
            <Switch checked={settings.data.hideScamTokens} onChange={(e) => {
                settings.data.hideScamTokens = e.target.checked
                settings.save()
            }} />
        </Box>
        <OutlinedPaper>
            {settings.data.hideScamTokens && <Alert severity="info">
                You will not see those scam tokens anywhere on the site.
            </Alert>}
            {!settings.data.hideScamTokens && <Alert severity="warning">
                You might see scam tokens on the site. Please be careful interacting with them.
            </Alert>}
        </OutlinedPaper>
        <Divider />

        <Typography variant="h6" fontWeight="bold">
            Theme
        </Typography>
        <Select value={settings.data.theme} onChange={(e) => {
            settings.data.theme = e.target.value as ThemeSetting
            settings.save()
        }}>
            <MenuItem value={ThemeSetting.Dark}>Dark</MenuItem>
            <MenuItem value={ThemeSetting.Light}>Light</MenuItem>
        </Select>
        {settings.data.theme === ThemeSetting.Light && <>
            <OutlinedPaper>
                <Alert severity="info">
                    Light mode is still a work in progress. Some parts of the app may not look right.
                </Alert>
            </OutlinedPaper>
        </>}
        <Divider />

        <Typography variant="h6" fontWeight="bold">
            Data Encoding
        </Typography>
        <Select value={settings.data.encoding} onChange={(e) => {
            settings.data.encoding = e.target.value as DataEncoding
            settings.save()
        }}>
            <MenuItem value={DataEncoding.Hex}>Hexadecimal</MenuItem>
            <MenuItem value={DataEncoding.Base64}>Base64</MenuItem>
        </Select>
        <Divider />

        <Typography variant="h6" fontWeight="bold">
            About
        </Typography>
        <Typography variant="body1">
            VITCScan is a blockchain explorer for the Vite network.
            All data is provided AS-IS and is not guaranteed to be accurate.
            <br />
            <br />
            If you find any issues, please report them in our <Link href="https://discord.gg/DZK7tyrs" target="_blank" rel="noopener noreferrer">Discord server</Link>.
        </Typography>
        <Divider />

        <Typography variant="h6" fontWeight="bold">
            Credits
        </Typography>
        <Typography variant="body1">
            Developer – Not Thomiz <Link href="https://twitter.com/NotThomiz" target="_blank" rel="noopener noreferrer">@NotThomiz</Link>
            <br />
            VITCScan's Icon – 5am <Link href="https://twitter.com/5am0036" target="_blank" rel="noopener noreferrer">@5am0036</Link>
            <br />
            <br />
            Backed by the <Link href="https://vitamincoin.org" target="_blank" rel="noopener noreferrer">Vitamin Coin</Link> project.
        </Typography>

        <Modal open={hideScamTokensInfoModalOpen} onClose={() => {
            setHideScamTokensInfoModalOpen(false)
        }}>
            <HideScamTokensInfoModal close={() => setHideScamTokensInfoModalOpen(false)} />
        </Modal>
    </Box>
}