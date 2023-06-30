import React, { createContext, useContext, useEffect, useState } from "react";
import { client } from "../../vite";

interface ISnapshotBlockContext {
    snapshotBlock: number | null
}

const SnapshotBlockContext = createContext<ISnapshotBlockContext>({} as ISnapshotBlockContext)

export function SnapshotBlockProvider({ children }:{
    children: React.ReactNode
}){
    const [snapshotBlock, setSnapshotBlock] = useState<number|null>(null)
    useEffect(() => {
        let cancel = snapshotBlock !== null

        client.methods.ledger.getSnapshotChainHeight()
        .then(height => {
            if(cancel)return
            setSnapshotBlock(height)
        })

        return () => {
            cancel = true
        }
    }, [snapshotBlock])
    useEffect(() => {
        let cancel = false
        client.subscribe("snapshotBlock")
        .then(subscription => {
            console.log(subscription)
            if(cancel)return
            subscription.events.on("data", (data) => {
                setSnapshotBlock(Number(data.height))
            })
        })

        return () => {
            cancel = true
        }
    }, [])

    return <SnapshotBlockContext.Provider value={{ snapshotBlock }}>
        {children}
    </SnapshotBlockContext.Provider>
}

export function useSnapshotBlock() {
    const context = useContext(SnapshotBlockContext)

    if(!context){
        throw new Error("useSnapshotBlock must be used within an SnapshotBlockProvider")
    }

    return context.snapshotBlock
}