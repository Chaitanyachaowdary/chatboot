// gemini-chatbot/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This proxies requests from your frontend's /api path
      // to the local serverless function endpoint.
      '/api': {
        target: 'http://localhost:3000', // This is the default port for local serverless functions (Vercel CLI / Netlify CLI)
        changeOrigin: true, // Needed for virtual hosts
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Rewrites the path (often not strictly needed for default Vercel/Netlify CLI behavior)
      },
    },
  },
});