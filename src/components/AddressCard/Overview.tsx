import { Alert, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow, alpha, darken, lighten, styled } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { AccountInfo, QuotaInfo } from "web3-vite"
import { DexFundBalances, balanceFormatter, numberFormatter, usdFormatter } from "../../utils"
import usePromise from "../../hooks/usePromise"
import { client, tokensMap } from "../../vite"
import { viteTokenId } from "web3-vite/dist/constants"
import BigNumber from "bignumber.js"
import { getPrices } from "../../prices"
import RouterLink from "../RouterLink"
import vitcswap, { getVITCSwapListedTokens } from "../../contracts/vitcswap"
import TableCellBorderTop from "../TableCellBorderTop"

export default function AddressCardOverview({
    address,
    accountInfo,
    dexfundBalances
}:{
    address: string,
    accountInfo: AccountInfo|undefined,
    dexfundBalances: DexFundBalances|undefined
}){
    const [quota, setQuota] = useState<QuotaInfo>()
    const [,tokens] = usePromise(() => {
        return tokensMap
    }, [])
    const [,prices,pricesError] = usePromise(async () => {
        return getPrices()
    }, [])
    const [, sbpVoteInfo] = usePromise(async () => {
        try{
            const sbp = await client.methods.contract.getVotedSBP(address)
            if(!sbp)return "Not voting for any SBP"
            return <RouterLink to={`/sbps/${sbp.blockProducerName}`}>{sbp.blockProducerName}</RouterLink>
        }catch(err){
            return <Alert severity="error">{(err as any).message}</Alert>
        }
    }, [address])
    const [, stakingQuota] = usePromise(() => {
        return client.methods.contract.getStakeList(address, 0, 1000)
    }, [address])
    const [, vitcswapBalances] = usePromise(async ({cancel}) => {
        if(!prices)return
        const vitePrice = prices[viteTokenId]
        const tokens = await tokensMap
        const listed = await getVITCSwapListedTokens()
        if(cancel)return

        const [
            viteUsdBalance,
            ...balances
        ] = await Promise.all([
            vitcswap.get("getVITEBalance", [address])
            .then(value => value.raw[0])
            .then(balance => 
                new BigNumber(balance)
                .times(vitePrice)
                .shiftedBy(-18)
            ),

            ...listed.map(token => {
                return vitcswap.get("getLiquidityTokenBalance", [address, token])
                    .then(value => [token, value.raw[0]])
            })
        ])
        if(cancel)return

        const usdLps = await Promise.all(
            balances.filter(([,balance]) => balance !== "0")
            .map(async ([tokenId, balance]) => {
                const token = tokens.get(tokenId)!
                const value = await vitcswap.get("getLiquidity", [tokenId])

                const tokenAmount = new BigNumber(balance)
                    .div(value.map.tknSupply)
                    .shiftedBy(-token.decimals)
                    .times(value.map.total)
                const viteAmount = new BigNumber(balance)
                    .div(value.map.tknSupply)
                    .shiftedBy(-18)
                    .times(value.map.totalVITE)

                return [
                    tokenId,
                    new BigNumber(tokenAmount)
                    .times(prices[tokenId])
                    .plus(viteAmount.times(vitePrice))
                ]
            })
        )
        
        return viteUsdBalance.plus(
            usdLps.reduce((sum, [,usd]) => sum.plus(usd), new BigNumber(0))
        ).toNumber()
    }, [address, prices])

    useEffect(() => {
        let cancel = false
        const fetchQuota = async () => {
            const quota = await client.methods.contract.getQuotaByAccount(address)
            if(cancel)return
            setQuota(quota)
        }
        fetchQuota()
        const interval = setInterval(fetchQuota, 1300)
        return () => {
            cancel = true
            clearInterval(interval)
        }
    }, [address])

    const transactions = useMemo(() => {
        if(!accountInfo)return <Skeleton />
        
        return numberFormatter.format(parseInt(accountInfo.blockCount))
    }, [accountInfo])
    const votes = useMemo(() => {
        if(!accountInfo)return <Skeleton />
        const balance = new BigNumber(accountInfo.balanceInfoMap?.[viteTokenId]?.balance ?? 0)
        .shiftedBy(-18)
        .toNumber()

        return `${balanceFormatter.format(
            balance
        )} VITE (=${usdFormatter.format(balance * (prices?.[viteTokenId] ?? 0))})`
    }, [accountInfo?.balanceInfoMap?.[viteTokenId]?.balance, prices])
    const accountWorth = useMemo(() => {
        if(pricesError)return <Alert severity="error">{pricesError.message}</Alert>
        if(!accountInfo || !prices || !tokens)return <Skeleton />

        const tokenIds = new Set<string>(Object.keys(accountInfo.balanceInfoMap ?? {}))
        for(const tokenId in dexfundBalances ?? {}){
            tokenIds.add(tokenId)
        }
        tokenIds.add(viteTokenId)

        let worth = new BigNumber(0)
        for(const tokenId of tokenIds){
            const chainbalance = accountInfo.balanceInfoMap?.[tokenId]?.balance ?? 0
            const dexlockedbalance = dexfundBalances?.[tokenId]?.locked ?? 0
            const dexavailablebalance = dexfundBalances?.[tokenId]?.available ?? 0
            const price = prices[tokenId]
            const token = tokens.get(tokenId)
            if(!price || !token)continue

            const totalBalance = new BigNumber(chainbalance)
            .plus(dexlockedbalance)
            .plus(dexavailablebalance)

            worth = worth.plus(
                totalBalance
                .shiftedBy(-token.decimals)
                .multipliedBy(price)
            )
        }
        worth = worth.plus(vitcswapBalances ?? 0)
        worth = worth.plus(
            new BigNumber(stakingQuota?.totalStakeAmount ?? 0)
            .shiftedBy(-18)
            .times(prices[viteTokenId] ?? 0)
        )

        return usdFormatter.format(worth.toNumber())
    }, [accountInfo, prices, tokens, dexfundBalances, stakingQuota, vitcswapBalances])

    return <TableContainer>
        <Table>
            <TableBody sx={{
                "td:last-child": {
                    fontWeight: "bold"
                },
                "td:first-of-type": {
                    width: "200px"
                }
            }}>
                <TableRow>
                    <TableCellBorderTop>Transactions</TableCellBorderTop>
                    <TableCellBorderTop>{transactions}</TableCellBorderTop>
                </TableRow>

                <TableRow>
                    <TableCellBorderTop>Quota</TableCellBorderTop>
                    <TableCellBorderTop>{quota ? `${
                        numberFormatter.format(parseInt(quota.currentQuota) / 21000)
                    }/${
                        numberFormatter.format(parseInt(quota.maxQuota) / 21000)
                    } UTPS` : <Skeleton />}</TableCellBorderTop>
                </TableRow>

                <TableRow>
                    <TableCellBorderTop>SBP Vote</TableCellBorderTop>
                    <TableCellBorderTop>
                        {sbpVoteInfo ?? <Skeleton />}
                    </TableCellBorderTop>
                </TableRow>

                <TableRow>
                    <TableCellBorderTop>Votes</TableCellBorderTop>
                    <TableCellBorderTop>
                        {votes}
                    </TableCellBorderTop>
                </TableRow>

                <TableRow>
                    <TableCellBorderTop>Total Staking Quota</TableCellBorderTop>
                    <TableCellBorderTop>
                        {stakingQuota?.totalStakeAmount ? balanceFormatter.format(
                            new BigNumber(stakingQuota.totalStakeAmount)
                            .shiftedBy(-18)
                            .toNumber()
                        ) + " VITE" : <Skeleton />}
                    </TableCellBorderTop>
                </TableRow>

                <TableRow>
                    <TableCellBorderTop>VITCSwap Liquidity</TableCellBorderTop>
                    <TableCellBorderTop>
                        {vitcswapBalances !== undefined ? usdFormatter.format(vitcswapBalances) : <Skeleton />}
                    </TableCellBorderTop>
                </TableRow>

                <TableRow>
                    <TableCellBorderTop>Net Worth</TableCellBorderTop>
                    <TableCellBorderTop>
                        {accountWorth}
                    </TableCellBorderTop>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
}