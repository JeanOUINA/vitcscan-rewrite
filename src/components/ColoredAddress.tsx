import { useTheme } from "@mui/material"
import { useMemo } from "react"

export default function ColoredAddress({address}:{address: string}){
    const theme = useTheme()
    const [
        prefix,
        middle,
        suffix
    ] = useMemo(() => {
        return [
            // vite_xxxxxxx
            address.slice(0, 5+7),
            // ...xxxxxx
            address.slice(5+7, -7),
            // ...xxxxxx
            address.slice(-7),
        ]
    }, [address])
    
    return <pre><code>
        <span style={{
            color: theme.palette.primary.main
        }}>{prefix}</span>    
        <span>{middle}</span>
        <span style={{
            color: theme.palette.primary.main
        }}>{suffix}</span>
    </code></pre>
}