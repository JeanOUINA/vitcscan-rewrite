import { EventEmitter } from "events"

export enum DataEncoding {
    Hex = "hex",
    Base64 = "base64"
}

export enum ThemeSetting {
    Dark = "dark",
    Light = "light"
}

export interface ISettings {
    encoding: DataEncoding,
    theme: ThemeSetting,
    hideScamTokens: boolean
}

export default class Settings extends EventEmitter {
    public static default(): ISettings {
        return {
            encoding: DataEncoding.Hex,
            theme: ThemeSetting.Dark,
            hideScamTokens: true
        }
    }

    public static fromJSON(json: string): Settings {
        return new Settings(Object.assign(this.default(), JSON.parse(json)))
    }

    public static toJSON(settings: ISettings): string {
        return JSON.stringify(settings)
    }

    public static fromLocalStorage(): Settings {
        const json = localStorage.getItem("settings")
        if (json) {
            return this.fromJSON(json)
        }
        return new Settings(this.default())
    }

    public static toLocalStorage(settings: ISettings) {
        localStorage.setItem("settings", this.toJSON(settings))
    }

    data: ISettings
    constructor(settings:ISettings){
        super()
        this.data = settings
    }
    
    save(){
        Settings.toLocalStorage(this.data)
        this.emit("change")
    }
}