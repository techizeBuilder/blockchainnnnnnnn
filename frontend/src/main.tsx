import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NetworkProvider } from "./lib/networkContext.tsx";

createRoot(document.getElementById("root")!).render(
    <NetworkProvider>
        <App />
    </NetworkProvider>
);
