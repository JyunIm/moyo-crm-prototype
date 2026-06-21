import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages는 https://<user>.github.io/<repo>/ 경로로 서빙되므로 base를 저장소명으로 지정한다.
export default defineConfig({
  plugins: [react()],
  base: "/moyo-crm-prototype/",
});
