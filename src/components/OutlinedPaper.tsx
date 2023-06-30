import { Paper, PaperProps } from "@mui/material";

export default function OutlinedPaper(props: Omit<PaperProps, "variant">){
    return <Paper {...props} variant="outlined" />
}