import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  build: { outDir: "docs", chunkSizeWarningLimit: 700000 },
  base: "/datatoy/"
})
