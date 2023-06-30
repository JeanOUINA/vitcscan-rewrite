import { useParams } from "react-router-dom";
import usePromise from "../hooks/usePromise";
import { tokensMap } from "../vite";
import { useMemo } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import FlatPaper from "../components/FlatPaper";
import { getTokenSummary } from "../utils";
import { getPrice } from "../prices";

export default function Token(){
    const { id } = useParams<"id">()
    const [loaded, tokens] = usePromise(() => tokensMap, [])

    const tokenInfo = useMemo(() => {
        return tokens?.get(id!)
    }, [id, tokens])

    const [, price] = usePromise(async () => {
        if(!tokenInfo)return
        return getPrice(tokenInfo.tokenId)
    }, [tokenInfo])

    const token = useMemo(() => {
        if(!tokenInfo)return

        return getTokenSummary(tokenInfo, price)
    }, [tokenInfo, price])

    if(!loaded)return <Box sx={{
        margin: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2
    }}>
        <CircularProgress />
    </Box>

    return <Box sx={{
        margin: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2
    }}>
        {!token ? <>
            <FlatPaper sx={{
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "fit-content"
            }}>
                <Typography variant="h4" fontWeight="bold">
                    Token not found
                </Typography>
                <Typography variant="body1">
                    The token you are looking for does not exist.
                </Typography>
            </FlatPaper>
        </> : <>
            <FlatPaper sx={{
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%"
            }}>
                <Typography variant="h4" fontWeight="bold">
                    {token.name}
                </Typography>
                <Typography variant="body1">
                    <pre><code>{token.symbol}</code></pre>
                </Typography>
                <Typography variant="body1">
                    <pre><code>{token.id}</code></pre>
                </Typography>
            </FlatPaper>
        </>}
    </Box>
}