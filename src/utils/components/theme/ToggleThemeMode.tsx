import {IconButton, useColorScheme} from "@mui/joy";

import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import LightMode from '@mui/icons-material/LightMode';

export function ToggleThemeButton() {
    const { mode, setMode } = useColorScheme();

    return (
        <IconButton
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        >
            {mode === 'light' ? <LightMode/> : <LightModeOutlined/>}
        </IconButton>
    );
}