import { Box, Divider, Link, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { AccountBlockV2, SnapshotBlock } from "web3-vite";
import FlatPaper from "./FlatPaper";
import RelativeTime from "./RelativeTime";
import RouterLink from "./RouterLink";
import usePromise from "../hooks/usePromise";
import { sbpsMap } from "../vite";

export interface SnapshotChunk {
    accountBlocks?: AccountBlockV2[] | undefined;
    snapshotBlock?: SnapshotBlock | undefined;
}

export default function SnapshotBlockList({
    chunks,
    header,
    footer
}:{
    chunks: SnapshotChunk[],
    header: React.ReactNode,
    footer: React.ReactNode
}){
    const [,sbps] = usePromise(() => {
        return sbpsMap
    }, [])
    return <FlatPaper sx={{
        width: "100%",
        maxWidth: "1000px",
    }}>
        {header}
        <Divider />
        <TableContainer>
            <Table>
                <TableBody>
                    {chunks.map(e => e || {}).map(({accountBlocks, snapshotBlock: block}, i) => {
                        if(!accountBlocks)accountBlocks = []
                        const sbp = block?.producer && sbps ? [...sbps.values()].find(sbp => sbp.blockProducingAddress === block.producer) ?? null : null
                        return <TableRow key={i} sx={{
                            "&:last-child td, &:last-child th": { border: 0 }
                        }}>
                            <TableCell>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1
                                }}>
                                    {
                                        block?.height ? <RouterLink to={`/snapshot/${block.height}`}>
                                            {block.height}
                                        </RouterLink> : <Skeleton variant="text" width={100} />
                                    }
                                    {block?.timestamp ? <RelativeTime timestamp={block.timestamp * 1000} /> : <Skeleton variant="text" width={100} />}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1
                                }}>
                                    <Typography variant="body1" sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 1
                                    }}>
                                        Produced by {
                                            sbp ? <RouterLink to={`/sbp/${sbp.sbpName}`}>
                                                {sbp.sbpName}
                                            </RouterLink> : <Skeleton variant="text" width={100} />
                                        }
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 1
                                    }}>
                                        {block ? accountBlocks.length : <Skeleton variant="text" width={30} />} txs
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        <Divider />
        {footer}
    </FlatPaper>
}