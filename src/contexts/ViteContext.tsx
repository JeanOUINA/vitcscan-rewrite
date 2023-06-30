import { SnapshotBlockProvider } from "./vite/SnapshotBlockContext"

export function ViteProvider({ children }:{
    children: React.ReactNode
}){
    return <SnapshotBlockProvider>
        {children}
    </SnapshotBlockProvider>
}