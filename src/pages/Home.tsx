import { Box, Grid, Skeleton, Typography } from "@mui/material";
import SearchField from "../components/SearchField";
import useIsMobile from "../hooks/useIsMobile";
import { useSnapshotBlock } from "../contexts/vite/SnapshotBlockContext";
import { numberFormatter, largeUsdFormatter, vitePriceFormatter } from "../utils";
import useCycle from "../hooks/useCycle";
import usePromise from "../hooks/usePromise";
import { client, sbpsMap, tokensMap } from "../vite";
import viteapi from "../viteapi";
import FlatPaper from "../components/FlatPaper";
import SnapshotBlockList, { SnapshotChunk } from "../components/SnapshotBlockList";
import { useEffect, useState } from "react";
import { ArrowForward } from "@mui/icons-material";
import RouterLink from "../components/RouterLink";
import { getPrice } from "../prices";
import { viteTokenId } from "web3-vite/dist/constants";
import BigNumber from "bignumber.js";

export default function Home() {
    const isMobile = useIsMobile()
    const snapshot = useSnapshotBlock()
    const cycle = useCycle()
    const [,tokens] = usePromise(() => tokensMap, [])
    const [,daoApy] = usePromise(() => viteapi.getVitaminCoinDAOApy(), [])
    const [,vitePrice] = usePromise(() => {
        return getPrice(viteTokenId)
    }, [])
    const [,sbps] = usePromise(() => sbpsMap, [])
    const [lastBlocks, setLastBlocks] = useState<SnapshotChunk[]>(new Array(10).fill(null))
    useEffect(() => {
        if(!snapshot)return
        let cancel = false

        client.methods.ledger.getChunks(snapshot, snapshot)
        .then(([chunk]) => {
            if(cancel)return
            setLastBlocks(blocks => [chunk!, ...blocks].slice(0, 10))
        })

        return () => {
            cancel = true
        }
    }, [snapshot])

    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "100px",
        gap: 2,
        marginLeft: 2,
        marginRight: 2
    }}>
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 1
        }}>
            {!isMobile && <img src={"/favicon.png"} draggable={false} style={{
                height: 100
            }}/>}
            <Typography variant="h1" sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontFamily: "poppins-semibold, poppins, sans-serif"
            }} color="primary">
                VITCScan
            </Typography>
        </Box>
        <SearchField sx={{
            maxWidth: "500px",
            width: "100%"
        }} />

        <Grid container spacing={1} sx={{
            width: "100%",
            maxWidth: "810px",
            justifyContent: "center",
            
            "& > * > *": {
                width: "100%",
                padding: 1
            }
        }}>
            <Grid item xs={6} sm={4} md={3}>
                <FlatPaper>
                    <Typography variant="h6" fontWeight="bold">
                        Vite Price
                    </Typography>

                    <Typography variant="h5">
                        {vitePrice ? vitePriceFormatter.format(vitePrice) : <Skeleton />}
                    </Typography>
                </FlatPaper>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
                <FlatPaper>
                    <Typography variant="h6" fontWeight="bold">
                        Market Cap
                    </Typography>

                    <Typography variant="h5">
                        {vitePrice && tokens ? largeUsdFormatter.format(
                            new BigNumber(vitePrice)
                            .times(tokens.get(viteTokenId)!.totalSupply)
                            .shiftedBy(-tokens.get(viteTokenId)!.decimals)
                            .toNumber()
                        ) : <Skeleton />}
                    </Typography>
                </FlatPaper>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
                <FlatPaper>
                    <Typography variant="h6" fontWeight="bold">
                        Snapshot Height
                    </Typography>

                    <Typography variant="h5">
                        {snapshot ? numberFormatter.format(snapshot) : <Skeleton />}
                    </Typography>
                </FlatPaper>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
                <FlatPaper>
                    <Typography variant="h6" fontWeight="bold">
                        Cycle
                    </Typography>

                    <Typography variant="h5">
                        {cycle}
                    </Typography>
                </FlatPaper>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
                <FlatPaper>
                    <Typography variant="h6" fontWeight="bold">
                        Tokens
                    </Typography>

                    <Typography variant="h5">
                        {tokens ? numberFormatter.format(tokens.size) : <Skeleton />}
                    </Typography>
                </FlatPaper>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
                <FlatPaper>
                    <Typography variant="h6" fontWeight="bold">
                        SBPs
                    </Typography>

                    <Typography variant="h5">
                        {sbps ? numberFormatter.format(sbps.size) : <Skeleton />}
                    </Typography>
                </FlatPaper>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
                <FlatPaper>
                    <Typography variant="h6" fontWeight="bold">
                        VITC DAO Apy
                    </Typography>

                    <Typography variant="h5">
                        {daoApy ? numberFormatter.format(daoApy.apy)+"%" : <Skeleton />}
                    </Typography>
                </FlatPaper>
            </Grid>
        </Grid>

        <SnapshotBlockList
            chunks={lastBlocks}
            header={
                <Box sx={{
                    padding: 2
                }}>
                    <Typography variant="h6" fontWeight="bold">
                        Latest Blocks
                    </Typography>
                </Box>
            }
            footer={
                <RouterLink to="/snapshots">
                    <Box sx={{
                        padding: 2,
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        color: "white"
                    }}>
                        <Typography variant="h6" fontWeight="bold" sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1
                        }}>
                            View all Blocks <ArrowForward />
                        </Typography>
                    </Box>
                </RouterLink>
            }
        />

        <Box sx={{marginBottom: 2}}></Box>
    </Box>
}