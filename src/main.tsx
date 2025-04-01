import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Root} from "./core/config/router/Root.tsx";
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root/>
  </StrictMode>,
)
