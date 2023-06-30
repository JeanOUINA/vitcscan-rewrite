import { Paper, PaperProps } from "@mui/material";
import { useSettings } from "../contexts/SettingsContext";
import { ThemeSetting } from "../Settings";

export default function FlatPaper(props: Omit<PaperProps, "variant">){
    const { settings: { data: settings }} = useSettings()
    return <Paper {...props} variant={settings.theme === ThemeSetting.Dark ? "elevation" : "outlined"} />
}