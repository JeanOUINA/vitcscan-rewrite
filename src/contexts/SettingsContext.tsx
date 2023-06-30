import React, { createContext, useContext, useEffect, useMemo } from "react";
import useRefresh from "../hooks/useRefresh";
import Settings from "../Settings";

interface ISettingsContext {
    settings: Settings
}

const SettingsContext = createContext<ISettingsContext>({} as ISettingsContext)

export function SettingsProvider({ children }:{
    children: React.ReactNode
}){
    const settings = useMemo(() => {
        return Settings.fromLocalStorage()
    }, [])
    const [, refresh] = useRefresh()
    useEffect(() => {
        settings.on("change", refresh)
        return () => {
            settings.off("change", refresh)
        }
    }, [settings, refresh])
    

    return <SettingsContext.Provider value={{ settings }}>
        {children}
    </SettingsContext.Provider>
}

export function useSettings(): ISettingsContext {
    const context = useContext(SettingsContext)

    if(!context){
        throw new Error("useSettings must be used within an SettingsProvider")
    }

    return context
}