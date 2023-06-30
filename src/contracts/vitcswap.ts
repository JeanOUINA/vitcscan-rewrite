import { client } from "../vite";
import VITCSwap from "web3-vite/dist/contracts/VITCSwap"

const vitcswap = new VITCSwap(client, "v1")
export default vitcswap

export async function getVITCSwapListedTokens(){
    try{
        const res = await fetch("https://vitcswap-api.thomiz.dev/api/pairs")
        const tokens:string[] = await res.json()
        return tokens
    }catch(err){
        return vitcswap.getTokens()
    }
}