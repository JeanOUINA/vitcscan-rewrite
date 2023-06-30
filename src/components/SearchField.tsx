import { TextField } from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidAddress, isValidTokenId } from "web3-vite";
import { client, sbpsMap } from "../vite";
import { toast } from "react-hot-toast";
import viteapi from "../viteapi";

export interface SubmitEvent {
    type: "address"|"hash"|"token"|"sbp"|"vitens"|"vinupay",
    value: string
}
export default function SearchField({
    sx = {}
}:{
    sx?: any
}):JSX.Element {
    const [value, setValue] = useState("")
    const navigate = useNavigate()

    const onChange = useCallback(async (event:React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const val = event.target.value
        const value = val.toLowerCase()
        const sbps = await sbpsMap

        if(isValidAddress(value)){
            setValue("")
            navigate(`/address/${value}`)
        }else if(/^[\da-f]{64}$/.test(value)){
            setValue("")
            const [
                snapshotBlock,
                accountBlock
            ] = await Promise.all([
                client.methods.ledger.getSnapshotBlockByHash(value),
                client.methods.ledger.getAccountBlockByHash(value)
            ])
            if(accountBlock){
                navigate(`/tx/${value}`)
            }else if(snapshotBlock){
                navigate(`/snapshot/${value}`)
            }else{
                setValue(val)
                toast.error("Invalid block hash")
            }
        }else if(isValidTokenId(value)){
            setValue("")
            navigate(`/token/${value}`)
        }else if(sbps.has(value)){
            setValue("")
            navigate(`/sbp/${value}`)
        }else if(/^[\w\d_]{1,18}\.vite$/.test(value)){
            setValue("")
            const name = await viteapi.getViteNSName(value.split(".")[0])
            navigate(`/vitens/${name.name}.vite`)
        }else if(/^[\w\d]{3,24}\.vinu$/.test(value)){
            setValue("")
            const name = await viteapi.getVinuPayName(value.split(".")[0])
            navigate(`/vinupay/${name.name}.vinu`)
        }else{
            setValue(val)
        }
    }, [navigate, setValue])

    return <TextField label="Address, Hash, Token, SBP or ViteNS/VinuPay Name" variant="filled" 
        sx={sx} value={value} onChange={(event) => {
            onChange(event)
            .catch((error) => {
                console.error(error)
                toast.error(error.message)
            })
        }} />
}