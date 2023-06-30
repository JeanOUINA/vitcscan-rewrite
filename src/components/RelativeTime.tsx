import { useEffect, useMemo } from "react"
import { relativeTimeFormatter } from "../utils"
import useRefresh from "../hooks/useRefresh"

export default function RelativeTime({
    timestamp
}: {
    timestamp: number
}){
    const [refreshId, refresh] = useRefresh()
    
    const time = useMemo(() => {
        return relativeTimeFormatter.format(Math.ceil((timestamp-Date.now())/1000), "seconds")
    }, [timestamp, refreshId])
    useEffect(() => {
        const interval = setInterval(refresh, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [refresh])

    return <span>{time}</span>
}