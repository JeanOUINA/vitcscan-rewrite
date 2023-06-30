import { useEffect } from "react"
import { Params, useNavigate, useParams } from "react-router-dom"

export default function RouterRedirect({
    to
}:{
    to: string | ((params: Readonly<Params<string>>) => string)
}){
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        navigate(typeof to === "string" ? to : to(params))
    }, [params, navigate, to])

    return null
}