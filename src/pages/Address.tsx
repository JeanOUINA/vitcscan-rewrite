import { Box, Tab, Tabs, Typography } from "@mui/material";
import FlatPaper from "../components/FlatPaper";
import { useParams } from "react-router-dom";
import ColoredAddress from "../components/ColoredAddress";
import AddressName from "../components/AddressName";
import { useMemo, useState } from "react";
import { AddressType, isValidAddress } from "web3-vite";
import useTitle from "../hooks/useTitle";
import AddressCardOverview from "../components/AddressCard/Overview";
import usePromise from "../hooks/usePromise";
import { client } from "../vite";
import { DexFundBalances } from "../utils";
import AddressCardBalance from "../components/AddressCard/Balance";

export enum AddressCardTab {
    Overview,
    Balance,
    NFTs,
    Analysis,
    Contract
}
export default function Address(){
    const { address } = useParams<{address: string}>()
    useTitle(`${address?.slice(0, 10)}...${address?.slice(-5)}`)
    // eslint-disable-next-line prefer-const
    let [tab, setTab] = useState<AddressCardTab>(AddressCardTab.Overview)
    const addressType = useMemo(() => {
        return isValidAddress(address ?? "")
    }, [address])

    const [,accountInfo] = usePromise(() => {
        return client.methods.ledger.getAccountInfoByAddress(address!)
    }, [address])
    const [,dexBalance] = usePromise<DexFundBalances>(() => {
        return client.request("dexfund_getAccountFundInfo", [address!])
    }, [address])

    if(tab === AddressCardTab.Contract && addressType !== AddressType.Contract){
        // do not use setTab as this isn't instant (next render)
        // and will not reset when the user navigates to another address that is a contract
        tab = AddressCardTab.Overview
    }

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
        <FlatPaper sx={{
            paddingTop: 2,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <AddressName
                    address={address!}
                    Component={({name}) => {
                        useTitle(`${name} (${address?.slice(0, 10)}...${address?.slice(-5)})`)
                        return <Typography variant="h6" fontWeight="bold">{name}</Typography>
                    }}
                />
                <ColoredAddress address={address!} />
            </Box>

            <Box sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <Tabs value={tab} onChange={(ev,tab) => {
                    setTab(tab as AddressCardTab)
                }}>
                    <Tab label="Overview" />
                    <Tab label="Balance" />
                    <Tab label="NFTs" />
                    <Tab label="Analysis" />
                    {addressType === AddressType.Contract && <Tab label="Contract" />}
                </Tabs>


                {tab === AddressCardTab.Overview && <AddressCardOverview
                    address={address!}
                    accountInfo={accountInfo}
                    dexfundBalances={dexBalance}
                />}
                {tab === AddressCardTab.Balance && <AddressCardBalance
                    
                />}
            </Box>

            
        </FlatPaper>

        <Box sx={{ marginBottom: 2 }}></Box>
    </Box>
}