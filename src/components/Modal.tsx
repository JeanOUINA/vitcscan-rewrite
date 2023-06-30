import { Box, Dialog } from "@mui/material"
import useIsMobile from "../hooks/useIsMobile"

export default function Modal(props:{
    open: boolean,
    children: React.ReactNode,
    onClose: () => void
}){
    const isMobile = useIsMobile()
    return <Dialog
        open={props.open}
        onClose={props.onClose}
        PaperProps={{
            elevation: 0,
            sx: {
                width: "100%",
                maxWidth: "600px",
                margin: isMobile ? 2 : 4,
            }
        }}
    >
        <Box sx={{
            margin: isMobile ? 2 : 4
        }}>
            {props.children}
        </Box>
    </Dialog>
}