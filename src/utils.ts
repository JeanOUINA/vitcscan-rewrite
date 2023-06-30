import BigNumber from "bignumber.js"
import { TokenInfo } from "web3-vite"

export const numberFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2
})
export const balanceFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 18,
})
export const vitePriceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 5,
    minimumFractionDigits: 5
})
export const largeUsdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
})
export const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
})
export const relativeTimeFormatter = new Intl.RelativeTimeFormat("en-US", {
    numeric: "auto"
})

export function getTokenSummary(token: TokenInfo, price: number|undefined){
    const flags = {
        bananoman: isBananoMan(token),
        bom: isBOM(token),
        vitoge: isVitoge(token),
        scam: false,

        vitc: isVITC(token),
    }
    if(flags.bananoman || flags.bom || flags.vitoge){
        flags.scam = true
    }
    return {
        symbol: `${token.tokenSymbol}-${token.index.toString().padStart(3, "0")}`,
        name: token.tokenName,
        id: token.tokenId,
        decimals: token.decimals,
        supply: token.totalSupply,
        price: price ?? 0,
        marketCap: new BigNumber(price ?? 0)
            ?.times(token.totalSupply)
            .shiftedBy(-token.decimals),
        flags: flags
    }
}

export const tokenFlags = {
    bananoman: [
        "vite_1bd7106135102023df9ec5c3385d85a534565077a8b2587375",
        "vite_1f949196da9aae91eb78605551c3f1d49ded0ee7648b717128",
        "vite_3508d0a96da9fde7a1b8e6c39444574380db42417aa9eba338",
        "vite_b36f3c1c98f6bc819a03e2b0337b6b81987b221b11a339142d",
        "vite_4b2b3768283e4d980f896970925dcc1fabf70bb8fb29f0a3d3",
        "vite_dc4549724b40b0418873e8ef1ab96dd0f23e8b0d6ff374740f",
        "vite_be000d8e970c16f29425d1dd1a314a9baa16a88bca0211a80e",
        "vite_978715b4c728e7d617176f25451cb9a187473d348338eb7bf4",
        "vite_cdd118688c072f1947e2754461e214f6849e6f3a3550489704"
    ],
    bom: [
        "tti_e463f70868334ebd591cff80"
    ],
    vitoge: [
        "tti_22a70f6a6c078f7f976c163e"
    ],
    vitc: [
        // Vitamin Coin
        "tti_22d0b205bed4d268a05dfc3c",
        // Gummy Bear
        "tti_b60ec4474e94e38b232c37fb",
        // VITCVITE
        "tti_95766b2aadc1c452f8762890",
        // VITCWBNB
        "tti_6312d2a685a9bd7a54250cb9",
        // VITCWONE
        "tti_f94c6bf7ffb1982691322d50",
        // VITCWUST
        "tti_c02dfff7255e31e43998415e"
    ]
}
export function isBananoMan(token: TokenInfo){
    return tokenFlags.bananoman.includes(token.owner)
}
export function isBOM(token: TokenInfo){
    return tokenFlags.bom.includes(token.tokenId)
}
export function isVitoge(token: TokenInfo){
    return tokenFlags.vitoge.includes(token.tokenId)
}
export function isVITC(token: TokenInfo){
    return tokenFlags.vitc.includes(token.tokenId)
}

export function isScam(token: TokenInfo){
    return isBananoMan(token) || isBOM(token) || isVitoge(token)
}

export type DexFundBalances = Record<string, {
    tokenInfo: TokenInfo,
    available: string,
    locked: string
}>