import {createRoot} from 'react-dom/client'
import {Root} from "./core/config/router/Root.tsx";
import './index.css'
import './i18n/i18nConf.js';
import {CssBaseline, CssVarsProvider} from "@mui/joy";
import {AppProvider} from "./core/config/app/AppProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <CssVarsProvider defaultMode={"light"}>
        <CssBaseline/>
        <AppProvider>
            <Root/>
        </AppProvider>
    </CssVarsProvider>
)
