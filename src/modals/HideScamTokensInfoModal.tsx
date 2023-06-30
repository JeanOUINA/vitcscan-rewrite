import { Close } from "@mui/icons-material"
import { Box, Divider, IconButton, Typography } from "@mui/material"

export default function HideScamTokensInfoModal({
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
                Hide Scam Tokens
            </Typography>

            <IconButton onClick={close}>
                <Close />
            </IconButton>
        </Box>
        <Divider />
        <Typography variant="body1">
            This option hides tokens that have been flagged as spam from the explorer. You will not see known scams from VITCScan. However, please note that the list of scams is not exhaustive and you may still see some scams.
        </Typography>
    </Box>
}