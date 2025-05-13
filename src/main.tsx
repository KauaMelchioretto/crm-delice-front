import {createRoot} from 'react-dom/client'
import {Root} from "./core/config/router/Root.tsx";
import './index.css'
import './i18n/i18nConf.js';
import {CssBaseline, CssVarsProvider} from "@mui/joy";

createRoot(document.getElementById('root')!).render(
    <CssVarsProvider defaultMode={"light"}>
        <CssBaseline/>
        <Root/>
    </CssVarsProvider>
)
