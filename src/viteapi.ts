import { ActionQueue } from "web3-vite"
import { waitNextTick } from "./vite"

export interface IViteNSName {
    name: string,
    owner: string
}
export type IVinuPayName = IViteNSName
export interface ISBPTracking {
    apy: number,
    startDate: string,
    trackingAddress: string
}

export default new class ViteAPI {
    BASE_URL = "https://vite-api.thomiz.dev"
    queue = new ActionQueue()

    async fetch(path:string, init: RequestInit = {}): Promise<any> {
        const url = new URL(path, this.BASE_URL)
        const res = await fetch(url.toString(), init)

        const text = await res.text()
        let json:any = {
            error: {
                name: "ServerError",
                message: "The json returned by the server couldn't be parsed."
            }
        }
        try{
            json = JSON.parse(text)
        }catch{}
        if(typeof json === "object" && json !== null && "error" in json){
            const err = new Error(json.error.message)
            err.name = json.error.name
            throw err
        }else {
            return json
        }
    }

    async getViteNSName(name: string):Promise<IViteNSName>{
        return this.fetch(`/vitens/name/${name}`)
    }
    async getVinuPayName(name: string):Promise<IVinuPayName>{
        return this.fetch(`/vinupay/name/${name}`)
    }

    async getVitaminCoinDAOApy():Promise<ISBPTracking>{
        return this.fetch("/vitcdao/apy")
    }

    addressNameQueue = new Set<string>()
    addressNameCache = new Map<string, string|undefined>()
    async getAddressName(address: string):Promise<string|undefined>{
        if(this.addressNameCache.has(address))return this.addressNameCache.get(address)
        return this.queue.queueAction(`addressname.${address}`, async () => {
            this.addressNameQueue.add(address)

            await this.queue.queueAction(`addressname`, async () => {
                if(this.addressNameCache.has(address))return
                await waitNextTick()

                if(!this.addressNameQueue.size)return

                const addresses = []
                for(let i = 0; i < 50 && this.addressNameQueue.size; i++){
                    const address = this.addressNameQueue.values().next().value
                    addresses.push(address)
                    this.addressNameQueue.delete(address)
                }

                const res:Record<string, string> = await this.fetch(`/names/resolve`, {
                    method: "POST",
                    body: JSON.stringify(addresses),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                for(const address in res){
                    this.addressNameCache.set(address, res[address])
                }
            })

            if(!this.addressNameCache.has(address)){
                this.addressNameCache.set(address, undefined)
            }
            
            return this.addressNameCache.get(address)
        })
    }
}