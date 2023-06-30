import { isScam } from "./utils"
import { tokensMap } from "./vite"

export async function getPrices():Promise<Record<string, number>>{
    const res = await fetch("https://prices.thomiz.dev/prices")
    const prices = await res.json()
    
    const tokens = await tokensMap
    for(const tokenId in prices){
        if(isScam(tokens.get(tokenId)!)){
            delete prices[tokenId]
        }
    }
    
    return prices
}
export async function getPrice(tokenId: string):Promise<number>{
    const res = await fetch(`https://prices.thomiz.dev/price/${tokenId}`)
    const price = await res.json()
    return price
}