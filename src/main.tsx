import "setimmediate"
import { Buffer } from "buffer";
window.Buffer = Buffer;
import ReactDOM from "react-dom/client"
import App from "./App"
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/overpass-mono";
import "@fontsource/poppins/600.css";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ViteProvider } from "./contexts/ViteContext";

const resize = () => {
    document.documentElement.style.setProperty("--window-height", `${window.innerHeight}px`)
}
resize()
window.addEventListener("resize", resize)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <SettingsProvider>
        <ViteProvider>
            <App />
        </ViteProvider>
    </SettingsProvider>
)