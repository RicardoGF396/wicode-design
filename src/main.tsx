import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AccentProvider } from "@/components/accent-provider.tsx"
import { NavColorProvider } from "@/components/nav-color-provider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <AccentProvider>
        <NavColorProvider>
          <App />
        </NavColorProvider>
      </AccentProvider>
    </ThemeProvider>
  </StrictMode>
)
