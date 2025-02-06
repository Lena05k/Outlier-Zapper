import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Histogram from "./Histogram";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <Histogram />
    </StrictMode>
);
