import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { tokensMap } from "../vite";
import usePromise from "../hooks/usePromise";
import { getTokenSummary, numberFormatter, vitePriceFormatter } from "../utils";
import FlatPaper from "../components/FlatPaper";
import BigNumber from "bignumber.js";
import { useSettings } from "../contexts/SettingsContext";
import { useMemo, useState } from "react";
import { Warning } from "@mui/icons-material";
import RouterLink from "../components/RouterLink";
import { getPrices } from "../prices";

export default function Tokens(){
    const { settings: { data: settings }} = useSettings()
    const [filter, setFilter] = useState("")
    const [, tokens] = usePromise(() => tokensMap, [])
    const [, prices] = usePromise(async () => {
        return getPrices()
    }, [tokens])

    const shownTokens = useMemo(() => {
        if(!tokens)return []
        let shownTokens = [...tokens.values()].map(token => {
            return getTokenSummary(token, prices?.[token.tokenId])
        })
        if(settings.hideScamTokens){
            shownTokens = shownTokens.filter(token => !token.flags.scam)
        }
        if(filter){
            shownTokens = shownTokens.filter(token => {
                return token.symbol.toLowerCase().includes(filter.toLowerCase())
                    || token.name.toLowerCase().includes(filter.toLowerCase())
                    || token.id.toLowerCase().includes(filter.toLowerCase())
            })
        }
        shownTokens = shownTokens.sort((a, b) => {
            // put scam tokens in bottom of list
            if(a.flags.scam && !b.flags.scam)return 1
            if(!a.flags.scam && b.flags.scam)return -1

            if(a.price && b.price){
                // sort by market cap
                if(a.marketCap.gt(b.marketCap))return -1
                if(a.marketCap.lt(b.marketCap))return 1
            }
            if(a.price && !b.price)return -1
            if(!a.price && b.price)return 1

            // sort by symbol
            return a.symbol.localeCompare(b.symbol)
        })

        return shownTokens
    }, [tokens, prices, settings.hideScamTokens, filter])
    const rows = useMemo(() => {
        if(!tokens){
            return new Array(10).fill(null).map((_, i) => <TableRow key={i}>
                <TableCell>
                    <Skeleton width={50} />
                </TableCell>
                
                <TableCell>
                    <Skeleton width={50} />
                </TableCell>

                <TableCell>
                    <Skeleton width={50} />
                </TableCell>

                <TableCell>
                    <Skeleton width={50} />
                </TableCell>

                <TableCell>
                    <Skeleton width={50} />
                </TableCell>

                <TableCell>
                    <Skeleton width={50} />
                </TableCell>

                <TableCell>
                    <Skeleton width={50} />
                </TableCell>
            </TableRow>)
        }

        return shownTokens!.map(token => {
            return <TableRow key={token.id}>
                <TableCell>
                    <RouterLink to={`/tokens/${token.id}`}>
                        <pre><code>{token.symbol}</code></pre>
                    </RouterLink>
                </TableCell>

                <TableCell>
                    <Typography sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1
                    }}>
                        {token.flags.scam && <Tooltip title="This token has been flagged as a scam">
                            <Warning color="warning"/>    
                        </Tooltip>} {token.name}
                    </Typography>
                </TableCell>

                <TableCell>
                    <pre><code>{token.id}</code></pre>
                </TableCell>

                <TableCell>
                    {token.decimals}
                </TableCell>

                <TableCell>
                    {numberFormatter.format(
                        new BigNumber(token.supply)
                        .shiftedBy(-token.decimals)
                        .toNumber()
                    )}
                </TableCell>

                <TableCell>
                    {vitePriceFormatter.format(
                        token.price ?? 0
                    )}
                </TableCell>

                <TableCell>
                    {vitePriceFormatter.format(
                        token.marketCap?.toNumber() ?? 0
                    )}
                </TableCell>
            </TableRow>
        })
    }, [tokens, shownTokens])

    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        gap: 2,
        marginLeft: 2,
        marginRight: 2
    }}>
        <Typography variant="h4" sx={{
            width: "100%"
        }}>Tokens</Typography>
        <Typography variant="h6" sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1
        }}>
            {!tokens ? <Skeleton width={50} /> : numberFormatter.format(tokens.size)} tokens
        </Typography>
        {tokens && tokens.size !== shownTokens!.length && <Typography variant="body1" sx={{
            width: "100%"
        }}>
            {numberFormatter.format(tokens.size - shownTokens.length)} tokens were hidden due to your settings
        </Typography>}
        <TextField
            fullWidth
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter tokens"
            sx={{
                width: "100%"
            }}
        />

        <FlatPaper sx={{
            width: "100%"
        }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Symbol
                            </TableCell>

                            <TableCell>
                                Name
                            </TableCell>
                            
                            <TableCell>
                                ID
                            </TableCell>
                            
                            <TableCell>
                                Decimals
                            </TableCell>
                            
                            <TableCell>
                                Supply
                            </TableCell>
                            
                            <TableCell>
                                Price
                            </TableCell>
                            
                            <TableCell>
                                Market Cap
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody sx={{
                        "& tr": {
                            "&:last-child td": {
                                borderBottom: "none"
                            }
                        }
                    }}>
                        {rows}
                    </TableBody>
                </Table>
                {tokens && !shownTokens?.length && <Box sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    padding: 2
                }}>
                    <Typography variant="h4" fontWeight="bold">No tokens found</Typography>
                    <Typography variant="body1">Try changing your settings or search query</Typography>
                </Box>}
            </TableContainer>
        </FlatPaper>

        <Box sx={{ marginBottom: 2 }}></Box>
    </Box>
}