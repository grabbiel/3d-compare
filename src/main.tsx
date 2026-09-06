import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createCompareApp } from './app/compare-app.ts'
import './index.css'
import { App } from './ui/app.tsx'

const app = createCompareApp({ persistKey: '3d-compare:v1' })
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App app={app} />
  </StrictMode>,
)
