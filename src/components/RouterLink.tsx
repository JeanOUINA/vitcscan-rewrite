import { Link as RouterLink } from "react-router-dom"
import { Link } from "@mui/material"

export default function({
    to,
    children
}:{
    to: string
    children: React.ReactNode
}){
    return <Link
        component={RouterLink}
        to={to}
    >
        {children}
    </Link>
}