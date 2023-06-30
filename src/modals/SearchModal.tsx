import { Box, IconButton, Typography } from "@mui/material"
import { Close } from "@mui/icons-material"
import SearchField from "../components/SearchField"

export default function SearchModal({
    close
}:{
    close: () => void
}){
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
                Search
            </Typography>

            <IconButton onClick={close}>
                <Close />
            </IconButton>
        </Box>

        <SearchField />
    </Box>
}