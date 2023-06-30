import { Client, SBPVoteInfo, TokenInfo } from "web3-vite";

window.process = {
    version: "18.0.0"
} as any
export const client = new Client("wss://node.vite.net/gvite/ws")

export async function getSBPs():Promise<Map<string, SBPVoteInfo>>{
    try{
        const sbps = await client.methods.contract.getSBPVoteList();
        return new Map(sbps.map(sbp => [sbp.sbpName, sbp] as [string, any]));
    }catch(err){
        console.error(err);
        throw new Error("Couldn't fetch SBPs list; Please refresh the page");
    }
}
export let sbpsMap = getSBPs()
setInterval(async () => {
    const val = await getSBPs().catch(() => null)
    if(val !== null){
        sbpsMap = Promise.resolve(val)
    }
}, 30 * 1000)

export async function getTokens():Promise<Map<string, TokenInfo>>{
    try{
        const { tokenInfoList: tokens } = await client.methods.contract.getTokenList(0, 1000)
        return new Map(tokens.map(token => [token.tokenId, token] as [string, any]))
    }catch(err){
        console.error(err)
        throw new Error("Couldn't fetch tokens list; Please refresh the page")
    }
}
export let tokensMap = getTokens()
setInterval(async () => {
    const val = await getTokens().catch(() => null)
    if(val !== null){
        tokensMap = Promise.resolve(val)
    }
}, 30 * 1000)

export function waitNextTick(){
    return new Promise<void>(resolve => setImmediate(resolve))
}