import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MoyoPrototype from "./MoyoPrototype";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MoyoPrototype />
  </StrictMode>
);
