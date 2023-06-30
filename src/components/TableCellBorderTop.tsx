import { TableCell, alpha, darken, lighten, styled } from "@mui/material"

export default styled(TableCell)(({ theme }) => {
    return {
        // this is taken from MUI's TableCell
        borderTop: `1px solid ${
            theme.palette.mode === "light" ?
            lighten(alpha(theme.palette.divider, 1), 0.88) :
            darken(alpha(theme.palette.divider, 1), 0.68)
        }`,
        borderBottom: "none"
    }
})