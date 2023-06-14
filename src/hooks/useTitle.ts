import { useEffect } from "react"

const defaultTitle = document.title
export default function useTitle(title: string) {
    useEffect(() => {
        document.title = title ? `${title} - ${defaultTitle}` : defaultTitle
        return () => {
            document.title = defaultTitle
        }
    }, [title])
}